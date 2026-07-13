import type { Request, Response } from "express";
import * as entity from "../entity";
import bcrypt from "bcrypt";
import { logger } from '../../utils/logger';
import jwt from "jsonwebtoken";
import { AppDataSource } from '../../db/datasource';






export const signUp = async(req: Request, res: Response) => {
    const{name, email, password} = req.body // stores input from body
    try{
        // Basic field validation
        if(!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        // email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(email).toLowerCase())) {
          return res.status(400).json({ message: "Invalid email address" });
        }

        // Minimal password length requirement
        if (String(password).length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

    // Check if the user already exists using TypeORM repository
    const userRepo = AppDataSource.getRepository(entity.User);
    const existingUser = await userRepo.findOne({ where: { email: email.toLowerCase() } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user via TypeORM
    const created = userRepo.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    const savedUser = await userRepo.save(created);
    // Only return safe fields
    const user = { id: savedUser.id, name: savedUser.name, email: savedUser.email };
    
     
    // Create a clean, simple object for the payload
const info = { 
  id: Number(user.id),     // Ensure it's a primitive number
  email: String(user.email) // Ensure it's a primitive string
};

//Passing the info 
    // Ensure JWT secret is configured token ctreation is done by auth middleware isAuthenticated
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not configured in environment');
      return res.status(500).json({ success: false, message: 'Server misconfiguration: auth secret missing' });
    }

    const token = jwt.sign(
      info,
      process.env.JWT_SECRET as string,
      {
        expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any,
      }
    );
    // Send Express response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: user,
    });

    }

   catch (error) {
    // Log the full error for diagnostics with log middleware
    logger.error({ err: error }, "Sign-up process failed unexpectedly");

    // Handle common Prisma unique constraint race (defensive)
    // Prisma client errors expose `code === 'P2002'` for unique constraint violations
    const maybeCode = (error as any)?.code;
    if (maybeCode === 'P2002') {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Fallback generic error
    return res.status(500).json({
      success: false,
      message: "Unexpected error: sign up failed."
    });
  } /* end of error catcher */
}// end of signUp



export const signIn = async (req: Request, res: Response) =>{
  const {email, password}= req.body;
  try{
    if (!email||!password){
      return res.status(400).json({
        success: false,
        message: "email and password required"
      });
    }
    // find by email using TypeORM
    const userRepo = AppDataSource.getRepository(entity.User);
    const user = await userRepo.findOne({ where: { email: email.toLowerCase(), deletedAt: null } });

    if(!user){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    const PasswordValid = await bcrypt.compare(password, user.password);
    if(!PasswordValid){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }


    
   // Create a clean, simple object for the payload
const info = {
  id: Number(user.id),     // Ensure it's a primitive number/string
  email: String(user.email) // Ensure it's a primitive string
};

// 2. Pass the info and cast the optionns
const token = jwt.sign(
  info, 
  process.env.JWT_SECRET as string, 
  { 
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any // 'any' bypasses strict type checking for the option
  }
);


    return res.status(200).json({
      success: true,
      message: "Sign-in completed",
      token,
      user:{
        id: user.id,
        email: user.email,
      }, //isAuth catch this this name is better but i don't want to change all my comments
    });
  } catch (error){
    logger.error({err: error}, "#panic sign in process failed");

  
    return res.status(500).json({
      success: false,
      message: "unexpected server error"
    });

  }
};



