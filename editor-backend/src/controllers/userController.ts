import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import * as UserService from "../services/services";
import bcrypt from "bcrypt";
import listEndpoints from 'express-list-endpoints';
import { logger } from '../utils/logger';
import jwt from "jsonwebtoken";
import router from "../routes/routes";
import { uploadToCloudinary } from "../utils/upload";



// Interface extension so TypeScript allows req.user and req.file
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}
interface ExpressEndpoint {
  path: string;
  methods: string[];
  middlewares: string[];
}

const parseStringifiedArray = (field: any): string[] => {
  if (!field) return [];
  if (Array.isArray(field)) return field.map(String);
  
  const trimmed = String(field).trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.map(String) : [trimmed];
    } catch {
      return [trimmed];
    }
  }
  return trimmed !== "" 
    ? trimmed.split(",").map(item => item.trim()) 
    : [trimmed];
};

export const routes = async(req: Request, res: Response) => {
  // Automatically scans Express internal routing table (works in production build)
  const rawEndpoints = listEndpoints(router) as ExpressEndpoint[];

  // Filter out the dashboard endpoint itself so it stays clean
  const filteredEndpoints = rawEndpoints.filter(ep => ep.path !== '/api/routes');

  // Generate a modern, highly readable HTML page on the fly
  const htmlDashboard = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Route Directory</title>
      <style>
        :root {
          --bg-main: #0f172a;
          --bg-card: #1e293b;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
          --get-color: #10b981;
          --post-color: #3b82f6;
          --put-color: #f59e0b;
          --delete-color: #ef4444;
        }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: var(--bg-main);
          color: var(--text-main);
          margin: 0;
          padding: 2rem;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
        }
        header {
          margin-bottom: 2rem;
          border-bottom: 1px solid #334155;
          padding-bottom: 1rem;
        }
        h1 { margin: 0; font-size: 1.75rem; color: #f1f5f9; }
        p { color: var(--text-muted); margin: 0.5rem 0 0 0; font-size: 0.95rem; }
        .badge-count {
          background: #334155;
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          font-size: 0.85rem;
        }
        .route-card {
          background-color: var(--bg-card);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid #334155;
          transition: transform 0.15s ease;
        }
        .route-card:hover {
          transform: translateX(4px);
          border-color: #475569;
        }
        .method-badge {
          font-family: monospace;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          min-width: 65px;
          text-align: center;
          text-transform: uppercase;
        }
        .GET { background: rgba(16, 185, 129, 0.15); color: var(--get-color); border: 1px solid rgba(16, 185, 129, 0.3); }
        .POST { background: rgba(59, 130, 246, 0.15); color: var(--post-color); border: 1px solid rgba(59, 130, 246, 0.3); }
        .PUT { background: rgba(245, 158, 11, 0.15); color: var(--put-color); border: 1px solid rgba(245, 158, 11, 0.3); }
        .DELETE { background: rgba(239, 68, 68, 0.15); color: var(--delete-color); border: 1px solid rgba(239, 68, 68, 0.3); }
        .path-text {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 1rem;
          color: #e2e8f0;
          flex-grow: 1;
        }
        .middleware-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
          background: #334155;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>Backend API Directory <span class="badge-count">${filteredEndpoints.length} total</span></h1>
          <p>Production environment active routes. Automatically mapped using application reflection.</p>
        </header>
        
        <main>
          ${filteredEndpoints.map(endpoint => 
            endpoint.methods.map(method => `
              <div class="route-card">
                <span class="method-badge ${method}">${method}</span>
                <span class="path-text">${endpoint.path}</span>
                ${endpoint.middlewares.length > 1 ? `<span class="middleware-tag">Has Middleware</span>` : ''}
              </div>
            `).join('')
          ).join('')}
        </main>
      </div>
    </body>
    </html>
  `;

  // Send down the visually complete web document
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(htmlDashboard);
}

export const signUp = async(req: Request, res: Response) => {
    const{name, email, password} = req.body // stores input from body
    try{
        if(!name||!email||!password)
            /*if no first name or no last name or no email or no password run the next code:-*/
        {
            return res.status(400).json({message:"All fields required"});
        }

     // 1. Check if the user already exists
     const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }, // Normalizing email to lowercase is highly recommended
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 2. Hash your password here before inserting (e.g., using bcrypt)

        const hashedPassword = await bcrypt.hash(password, 10); //call bcrypt to hash password and save hashed password

        const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
      // Safely return only the fields the frontend needs
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    
     
    // 1. Create a clean, simple object for the payload
const payload = { 
  id: Number(user.id),     // Ensure it's a primitive number/string
  email: String(user.email) // Ensure it's a primitive string
};

// 2. Pass the clean payload and cast the options
const token = jwt.sign(
  payload, 
  process.env.JWT_SECRET as string, 
  { 
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any // 'any' bypasses strict type checking for the option
  }
);
    //  5. Send the proper Express response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: user,
    });

    }

   catch (error) {
    // 1. Log the full error to server side logging system (e.g, Winston, Sentry, or Pino) using Pino instead of console.error
    logger.error({ err: error }, "Sign-up process failed unexpectedly");

    // 2. Return a generic JSON response to the user
    return res.status(500).json({
      success: false,
      message: "Unexpected error sign up failed."
    });
}/*end of error catcher*/
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
    //find by email
    const user = await prisma.user.findUnique({
      where: {email: email.toLowerCase(), deletedAt: null},
    });

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


    
   // 1. Create a clean, simple object for the payload
const payload = { 
  id: Number(user.id),     // Ensure it's a primitive number/string
  email: String(user.email) // Ensure it's a primitive string
};

// 2. Pass the clean payload and cast the options
const token = jwt.sign(
  payload, 
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
      },
    });
  } catch (error){
    logger.error({err: error}, "#panic sign in process failed");

  
    return res.status(500).json({
      success: false,
      message: "unexpected server error"
    });

  }
};

//get all users to be used by admin
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();

    // Return a structured, successful JSON response
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    // The service already logged the full trace, so just sending the user response here
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

export const createData = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const { title, description, tags, demoUrl, githubUrl, otherlinks, imageUrl } = req.body;
    
    if (!req.user?.id) return res.status(401).json({ success: false, message: "Unauthorized access." });
    const authorId = Number(req.user.id);
    
    if (!title || !description) return res.status(400).json({ success: false, message: "Title and description required." });

    // Process multiple incoming images concurrently
    const files = req.files as Express.Multer.File[];
    let uploadedImageUrls: string[] = [];

    if (files && files.length > 0) {
      const folderPath = "portfolio_assets";
      const uploadPromises = files.map(file => 
        uploadToCloudinary(file.buffer, folderPath, authorId.toString())
      );
      uploadedImageUrls = await Promise.all(uploadPromises);
    }

    // Process existing imageUrl array if provided
    if (imageUrl) {
      const parsedExistingImages = parseStringifiedArray(imageUrl);
      uploadedImageUrls = [...uploadedImageUrls, ...parsedExistingImages];
    }

    // Parse incoming text array assets securely
    const parsedTags = parseStringifiedArray(tags);
    const parsedOtherLinks = parseStringifiedArray(otherlinks);

    // Commit to Prisma with explicit schema constraints
    const newVals = await prisma.data.create({
      data: {
        title: String(title),
        description: String(description),
        authorId: authorId,
        imageUrl: uploadedImageUrls,
        tags: parsedTags,
        demoUrl: demoUrl ? String(demoUrl) : null,
        githubUrl: githubUrl ? String(githubUrl) : null,
        otherlinks: parsedOtherLinks
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        tags: true,
        demoUrl: true,
        githubUrl: true,
        otherlinks: true,
        authorId: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      success: true,
      message: `${uploadedImageUrls.length} file(s) uploaded and record created successfully!`,
      data: newVals
    });

  } catch (error) {
    logger.error({ err: error }, "Failed to execute multi-image upload creation pipeline.");
    return res.status(500).json({ success: false, message: "Save failed." });
  }
};



export const updateData = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
   
    const { title, description, tags, demoUrl, githubUrl, otherlinks, removeImages } = req.body;

    const recordId = Number(req.params.id);
    if (isNaN(recordId)) return res.status(400).json({ success: false, message: "Invalid record parameter ID." });
    
    if (!req.user?.id) return res.status(401).json({ success: false, message: "Unauthorized access." });
    const authorId = Number(req.user.id);

    const record = await prisma.data.findUnique({ where: { id: recordId } });
    if (!record) return res.status(404).json({ success: false, message: "Data record not found." });
    if (record.authorId !== authorId) return res.status(403).json({ success: false, message: "Forbidden: You do not own this data record." });

    let updatedImageUrls = [...record.imageUrl];

    if (removeImages) {
      const urlsToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      updatedImageUrls = updatedImageUrls.filter(url => !urlsToRemove.includes(url));
    }

    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const folderPath = "portfolio_assets";
      const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, folderPath, authorId.toString()));
      const newImageUrls = await Promise.all(uploadPromises);
      updatedImageUrls = [...updatedImageUrls, ...newImageUrls];
    }

   
    const parsedTags = tags !== undefined ? parseStringifiedArray(tags) : undefined;
    const parsedOtherLinks = otherlinks !== undefined ? parseStringifiedArray(otherlinks) : undefined;

   
    const updated = await prisma.data.update({
      where: { id: recordId },
      data: { 
        title: title || undefined, 
        description: description || undefined, 
        tags: parsedTags,
        demoUrl: demoUrl !== undefined ? String(demoUrl) : undefined,
        githubUrl: githubUrl !== undefined ? String(githubUrl) : undefined,
        otherlinks: parsedOtherLinks,
        imageUrl: updatedImageUrls
      }
    });

    return res.status(200).json({ 
      success: true, 
      message: "Data record and assets updated successfully", 
      data: updated 
    });

  } catch (error) {
    logger.error({ err: error }, "Failed to update data record with assets");
    return res.status(500).json({ success: false, message: "Update execution failed." });
  }
};


export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.user?.id) return res.status(401).json({ success: false, message: "Unauthorized access." });
    const targetUserId = Number(req.user.id);

    await prisma.user.update({
      where: { id: targetUserId },
      data: { deletedAt: new Date() }
    });

    return res.status(200).json({ success: true, message: "Account has been successfully deactivated." });
  } catch (error) {
    logger.error({ err: error }, `Soft delete failed for user ID: ${req.user?.id}`);
    return res.status(500).json({ success: false, message: "An unexpected server error occurred during deactivation." });
  }
};

// Notice the change from Request to AuthenticatedRequest here too
export const adminDeleteUser = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  const { id } = req.params;
  const targetUserId = parseInt(id as string, 10);
  
  if (isNaN(targetUserId)) return res.status(400).json({ success: false, message: "Invalid user ID format." });
  if (!req.user?.id) return res.status(401).json({ success: false, message: "Unauthorized access." });

  if (targetUserId === Number(req.user.id)) {
    return res.status(400).json({ success: false, message: "You cannot deactivate your own account through this endpoint." });
  }

  try {
    await prisma.user.update({
      where: { id: targetUserId, deletedAt: null },
      data: { deletedAt: new Date() }
    });
    return res.status(200).json({ success: true, message: `User account (ID: ${targetUserId}) has been successfully deactivated by Admin.` });
  } catch (error) {
    logger.error({ err: error }, `Admin soft-delete failed for target user ID: ${targetUserId} by Admin ID: ${req.user.id}`);
    return res.status(500).json({ success: false, message: "An unexpected server error occurred." });
  }
};

export const getData = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    // Convert to number to match your database column criteria
    const authorId = Number(req.user.id);

    // Strict ownership verification query filter block
    const userRecords = await prisma.data.findMany({
      where: { authorId: authorId },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({ success: true, count: userRecords.length, data: userRecords });
  } catch (error) {
    logger.error({ err: error }, `Failed to fetch data records for user ID: ${req.user?.id}`);
    return res.status(500).json({ success: false, message: "An unexpected error occurred while retrieving your data." });
  }
};


export const deleteSingleData = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const recordId = Number(req.params.id);
    if (isNaN(recordId)) {
      return res.status(400).json({ success: false, message: "Invalid record parameter ID." });
    }

    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }
    const authorId = Number(req.user.id);

    const record = await prisma.data.findUnique({ where: { id: recordId } });
    if (!record) {
      return res.status(404).json({ success: false, message: "Data record not found." });
    }
    if (record.authorId !== authorId) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not own this data record." });
    }

    await prisma.data.delete({ where: { id: recordId } });
    return res.status(200).json({ success: true, message: "Asset records unlinked successfully." });
  } catch (error) {
    logger.error({ err: error }, `Failed to delete data record with ID: ${req.params.id}`);
    return res.status(500).json({ success: false, message: "Deletion execution failed." });
  }
};
