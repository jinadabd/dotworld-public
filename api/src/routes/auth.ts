import { Router } from "express";
import { login, me, signup } from "../controllers/authController.ts";
import { authLimiter } from "../middleware/rateLimit.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const AuthRouter = Router();

AuthRouter.post("/signup", authLimiter, signup);
AuthRouter.post("/login", authLimiter, login);
AuthRouter.get("/me", requireAuth, me);

export default AuthRouter;
