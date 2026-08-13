import "./config/dotenv.ts";
import express, { type Request, type Response } from "express";
// import userRouter from "./routes/user.ts";
import authRouter from "./routes/auth.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use("/auth", authRouter);
// server.use("/", homeRouter);
server.use("/:username", authRouter);
server.use(errorHandler);

server.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));
