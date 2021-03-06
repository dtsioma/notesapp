import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { createTokens } from "../auth";
import { User } from "../models/User";

@ObjectType()
class UserResponse {
  @Field()
  id: number;

  @Field()
  email: string;
}

@Resolver()
export class UserResolver {
  // return my user
  @Query(() => UserResponse)
  async me(@Ctx() { req }: any) {
    if (!req.userId) {
      return null;
    }

    const user = await User.findOne(req.userId);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      count: user.count,
    };
  }

  @Query(() => Boolean)
  isLoggedIn(@Ctx() { req }: any) {
    if (!req.userId) {
      return false;
    }
    return true;
  }

  // return all users
  @Query(() => [UserResponse])
  async users() {
    const users = await User.find();
    if (!users) {
      return null;
    }
    return users.map((u) => ({ id: u.id, email: u.email }));
  }

  // get user data
  @Query(() => UserResponse)
  async user(@Arg("id") id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      count: user.count,
    };
  }

  // register user
  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
    }).save();

    return {
      id: user.id,
      email: user.email,
      password: user.password,
    };
  }

  // login user
  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: any
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found");
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error("Password is incorrect");
    }

    const { accessToken, refreshToken } = createTokens(user);

    res.cookie("refresh-token", refreshToken);
    res.cookie("access-token", accessToken);

    return {
      id: user.id,
      email: user.email,
      count: user.count,
    };
  }

  // logout user
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: any) {
    res.clearCookie("refresh-token");
    res.clearCookie("access-token");

    return true;
  }

  // invalidate tokens
  @Mutation(() => Boolean)
  async invalidateTokens(@Ctx() { req }: any) {
    if (!req.userId) {
      return false;
    }

    const user = await User.findOne(req.userId);
    if (!user) {
      return false;
    }
    user.count += 1;
    await user.save();

    return true;
  }
}
