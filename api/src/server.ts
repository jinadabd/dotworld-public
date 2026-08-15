import "./config/dotenv.ts";
import express, { type Request, type Response } from "express";
// import userRouter from "./routes/user.ts";
import authRouter from "./routes/auth.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { composeRouter, postsRouter } from "./routes/posts.ts";
import TrinketRouter from "./routes/trinkets.ts";

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use("/auth", authRouter);
// server.use("/", homeRouter);
// server.use("/:username", authRouter);

server.use("/compose", composeRouter);

server.use("/posts", postsRouter);
// server.use("/:userId/posts", postsRouter);

server.use("/trinkets", TrinketRouter);
// server.use("/:userId/trinkets", TrinketRouter);

server.use(errorHandler);

server.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));
