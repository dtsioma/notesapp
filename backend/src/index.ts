import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { NoteResolver } from "./resolvers/NoteResolver";
import { UserResolver } from "./resolvers/UserResolver";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./models/User";
import { createTokens } from "./auth";
import cors from 'cors'

(async () => {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.use(async (req: any, res, next) => {
    const refreshToken = req.cookies["refresh-token"];
    const accessToken = req.cookies["access-token"];
    // if we don't have neither -> next()
    if (!refreshToken && !accessToken) {
      return next();
    }

    // try verifying accessToken
    try {
      const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as any;
      req.userId = data.userId;
      return next();
    } catch {}

    // if we don't have refreshToken -> next()
    if (!refreshToken) {
      return next();
    }

    let data;

    // try verifying refreshToken
    try {
      data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
    } catch {
      return next();
    }

    const user = await User.findOne(data.userId);
    // token has been invalidated
    if (!user || user.count !== data.count) {
      return next();
    }

    const tokens = createTokens(user);
    res.cookie("refresh-token", tokens.refreshToken);
    res.cookie("access-token", tokens.accessToken);
    req.userId = user.id;

    return next();
  });

  app.get("/", (req, res) => res.send("Hello from Express Server"));

  await createConnection();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [NoteResolver, UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Express server started!");
  });
})();
