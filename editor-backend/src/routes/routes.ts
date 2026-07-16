import { Router } from "express";
import { 
  signUp, signIn, getUsers, routes, updateData, getData, createData, deleteUser, adminDeleteUser,
  deleteSingleData
} from "../controllers/userController";
import { isAuthentication, authorizeRoles } from "../utils/Authentication";
import { uploadi } from "../services/multer";


const router = Router();

// --- Public Routes ---
router.get("/routes", routes);
router.post("/signUp", signUp);
router.post("/signIn", signIn);

// --- Authenticated Routes (Require Login) ---
// Added isAuthentication to all routes below tis

// Replace your PUT route block with this array-enabled tracking middleware:
router.put("/data/:id", isAuthentication, uploadi.array("images", 10), updateData);
router.get("/data", isAuthentication, isAuthentication, getData);
router.post("/data", isAuthentication, uploadi.array("images", 10), createData);

router.delete("/data/:id", isAuthentication, deleteSingleData)
router.delete("/data/user/:id",isAuthentication, deleteUser)

// --- Admin/Moderator Only Routes ---
router.get("/admin/users", isAuthentication, authorizeRoles("ADMIN"), getUsers);
router.delete("/users/:id", isAuthentication, authorizeRoles("ADMIN"), adminDeleteUser);


export default router;