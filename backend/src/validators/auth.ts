 import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../db/datasource";
import * as entity from "../controllers/entity";

 
 // Extend Express Request type to include 'user'
 declare global {
   namespace Express {
     interface Request {
       user?: any; 
     }
   }
 }
 
 export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.headers.authorization;
 
   if (!authHeader || !authHeader.startsWith("Bearer ")) {
     return res.status(401).json({ message: "No token provided" });
   }
 
   const token = authHeader.split(" ")[1];
 
   try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };


 const userRepo = AppDataSource.getRepository(entity.User);
    const found = await userRepo.findOne({ where: { id: Number(decoded.id), deletedAt: undefined } });
    if (!found) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    // Sanitize and attach minimal user info
    req.user = { id: found.id, email: found.email, role: found.role };
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
       await entity.LogActivity ({
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