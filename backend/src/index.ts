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

(async () => {
  const app = express();

  app.use(cookieParser());

  app.use((req, res, next) => {
    const accessToken = req.cookies["access-token"];
    try {
      const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as any;
      (req as any).userId = data.userId;
    } catch (err) {}
    next();
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
