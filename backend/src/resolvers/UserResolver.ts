import { compare, hash } from "bcryptjs";
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../models/User";

@Resolver()
export class UserResolver {
  // return all users
  @Query(() => [User])
  async users() {
    const users = await User.find();
    if (!users) {
      return null;
    }
    return users;
  }

  // get user data
  @Query(() => User)
  async user(@Arg("id") id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    return user;
  }

  // register user
  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
    }).save();

    return true;
  }

  // login user
  @Mutation(() => User)
  async login(@Arg("email") email: string, @Arg("password") password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return null;
    }

    return user;
  }
}
