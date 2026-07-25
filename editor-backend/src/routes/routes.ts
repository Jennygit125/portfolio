import { Router } from "express";
import { prisma } from "../lib/prisma";
import { 
  signUp, signIn, getUsers, routes as baseRoutes, updateData, getData, createData, deleteUser, adminDeleteUser,
  deleteSingleData
} from "../controllers/userController";
import { isAuthentication, authorizeRoles } from "../utils/Authentication";
import { uploadi } from "../services/multer";

const router = Router();

// --- Public Routes ---
router.get("/routes", baseRoutes);
router.post("/signUp", signUp);
router.post("/signIn", signIn);

router.get("/projects/public", async (_req, res) => {
  try {
    const projects = await prisma.data.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        tags: true,
        demoUrl: true,
        githubUrl: true,
        otherlinks: true,
      },
    });

    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public projects",
    });
  }
});

router.get("/projects/user/:id", async (req, res) => {
  try {
    const authorId = parseInt(req.params.id, 10);
    if (isNaN(authorId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    const projects = await prisma.data.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
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
      },
    });

    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch user projects" });
  }
});

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "bakreeniola2@gmail.com",
        subject: `Portfolio contact form from ${name}`,
        reply_to: email,
        html: `
          <div>
            <h2>New message from your portfolio</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      return res.status(500).json({
        message: "Failed to send email",
        details: errorBody,
      });
    }

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Unexpected error sending email",
    });
  }
});

// --- Authenticated Projects Routes ---
router.get("/projects", isAuthentication, getData);
router.post("/projects", isAuthentication, uploadi.array("images", 10), createData);
router.put("/projects/:id", isAuthentication, uploadi.array("images", 10), updateData);
router.delete("/projects/:id", isAuthentication, deleteSingleData);

// --- User Account Routes ---
router.delete("/user/:id", isAuthentication, deleteUser);

// --- Admin/Moderator Only Routes ---
router.get("/admin/users", isAuthentication, authorizeRoles("ADMIN"), getUsers);
router.delete("/users/:id", isAuthentication, authorizeRoles("ADMIN"), adminDeleteUser);

export default router;