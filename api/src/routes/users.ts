import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import { getUser, searchUsers } from "../controllers/userController.ts";

const UsersRouter = Router();

UsersRouter.get("/search", requireAuth, searchUsers);
UsersRouter.get("/:userId", requireAuth, getUser);

export default UsersRouter;
