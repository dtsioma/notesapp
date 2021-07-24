import { sign } from "jsonwebtoken";
import { User } from "./models/User";

export const createTokens = (user: User) => {
  const accessToken = sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = sign(
    { userId: user.id, count: user.count },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );

  return { refreshToken, accessToken };
};
