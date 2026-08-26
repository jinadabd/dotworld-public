import "./config/dotenv.ts";
import express, { type Request, type Response } from "express";

import authRouter from "./routes/auth.ts";
import TrinketRouter from "./routes/trinkets.ts";
import FriendsRouter from "./routes/friends.ts";
import { ComposeRouter, PostsRouter } from "./routes/posts.ts";
import IslandRouter from "./routes/islands.ts";
import UsersRouter from "./routes/users.ts";

import { errorHandler } from "./middleware/errorHandler.ts";

import cors from "cors";
import UploadRouter from "./routes/uploads.ts";
import ChatterRouter from "./routes/chatter.ts";
import path from "path";

const server = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173"];
const allowedOrigins = [process.env.FRONTEND_URL];

server.use(cors({ origin: allowedOrigins, credentials: false }));
server.use(express.json());
server.use("/auth", authRouter);

server.use("/compose", ComposeRouter);
server.use("/posts", PostsRouter);

server.use("/chatter", ChatterRouter);

server.use("/trinkets", TrinketRouter);

server.use("/friends", FriendsRouter);

server.use("/users", UsersRouter);

server.use("/uploads", UploadRouter);

server.use("/", IslandRouter);

server.use(errorHandler);

server.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));
