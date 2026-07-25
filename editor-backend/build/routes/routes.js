import { Router } from "express";
import { prisma } from "../lib/prisma";
import { signUp, signIn, getUsers, routes, updateData, getData, createData, deleteUser, adminDeleteUser, deleteSingleData } from "../controllers/userController";
import { isAuthentication, authorizeRoles } from "../utils/Authentication";
import { uploadi } from "../services/multer";
const router = Router();
// --- Public Routes ---
router.get("/routes", routes);
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
                links: true,
            },
        });
        return res.status(200).json({ success: true, data: projects });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch public projects",
        });
    }
});
router.get("/projects/:id", async (req, res) => {
    const projectId = Number(req.params.id);
    if (Number.isNaN(projectId)) {
        return res.status(400).json({ success: false, message: "Invalid project id" });
    }
    try {
        const project = await prisma.data.findUnique({
            where: { id: projectId },
            select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                links: true,
            },
        });
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        return res.status(200).json({ success: true, data: project });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch project",
        });
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Unexpected error sending email",
        });
    }
});
router.get("/projects", isAuthentication, getData);
router.post("/projects", isAuthentication, uploadi.array("images", 10), createData);
router.put("/projects/:id", isAuthentication, uploadi.array("images", 10), updateData);
router.delete("/projects/:id", isAuthentication, deleteSingleData);
// --- Authenticated Routes (Require Login) ---
// Added isAuthentication to all routes below tis
router.put("/data/:id", isAuthentication, uploadi.array("images", 10), updateData);
router.get("/data", isAuthentication, getData);
router.post("/data", isAuthentication, uploadi.array("images", 10), createData);
router.delete("/data/:id", isAuthentication, deleteSingleData);
router.delete("/data/user/:id", isAuthentication, deleteUser);
// --- Admin/Moderator Only Routes ---
router.get("/admin/users", isAuthentication, authorizeRoles("ADMIN"), getUsers);
router.delete("/users/:id", isAuthentication, authorizeRoles("ADMIN"), adminDeleteUser);
export default router;
//# sourceMappingURL=routes.js.map