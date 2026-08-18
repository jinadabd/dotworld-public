import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import { signUpload } from "../controllers/uploadController.ts";

const UploadRouter = Router();
UploadRouter.post("/sign", requireAuth, signUpload);

export default UploadRouter;
