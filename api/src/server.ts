import "./config/dotenv.ts";
import express, { type Request, type Response } from "express";

import authRouter from "./routes/auth.ts";
import TrinketRouter from "./routes/trinkets.ts";
import FriendsRouter from "./routes/friends.ts";
import { composeRouter, postsRouter } from "./routes/posts.ts";
import IslandRouter from "./routes/islands.ts";
import UsersRouter from "./routes/users.ts";

import { errorHandler } from "./middleware/errorHandler.ts";

import cors from "cors";

const server = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173"];
// const allowedOrigins = [process.env.FRONTEND_URL];

server.use(cors({ origin: allowedOrigins, credentials: false }));
server.use(express.json());
server.use("/auth", authRouter);

server.use("/compose", composeRouter);
server.use("/posts", postsRouter);

server.use("/trinkets", TrinketRouter);

server.use("/friends", FriendsRouter);

server.use("/users", UsersRouter);

server.use("/", IslandRouter);

server.use(errorHandler);

server.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));
