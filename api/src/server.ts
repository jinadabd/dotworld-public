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

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL].filter(
	Boolean,
) as string[];

server.use(cors({ origin: allowedOrigins, credentials: false }));

// Resolve path relative to project root
const frontendDistPath = path.resolve(process.cwd(), "../web/dist");

// 1. Serve static built React assets
server.use(express.static(frontendDistPath));

// 2. Catch-all route for Express 5 compatibility
server.get("{*path}", (req, res) => {
	res.sendFile(path.join(frontendDistPath, "index.html"));
});

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
