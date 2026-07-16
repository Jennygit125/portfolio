import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma"; // Your Prisma client
import { logActivity} from "./activtyLogger";

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

export const isAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    
    // Prisma: Replace User.findById with findUnique
   // --- Update the findUnique query inside your isAuthentication middleware ---

const user = await prisma.user.findUnique({
  where: { 
    id: Number(decoded.id), // Enforce safe integer parsing matching your database type
    deletedAt: null
  },
  // CRUCIAL: Explicitly select ONLY scalar properties. This stops Prisma from introspecting relations!
  select: { 
    id: true, 
    email: true, 
    role: true 
  }
});


    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (e: any) {
    if (e.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    if (e.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Safety check for user existence
    if (!req.user || !roles.includes(req.user.role)) {
      await logActivity({
        action: "FORBIDDEN_ACCESS",
        userId: req.user?.id,
        ipAddress: req.ip || "",
        metadata: {
          method: req.method,
          path: req.originalUrl,
          role: req.user?.role,
          allowedRoles: roles
        }
      });

      return res.status(403).json({ message: "Forbidden: insufficient permission" });
    }
    next();
  };
};