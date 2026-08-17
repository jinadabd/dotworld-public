import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import { getUser } from "../controllers/userController.ts";

const UsersRouter = Router();

UsersRouter.get("/:userId", requireAuth, getUser);

export default UsersRouter;
