import { Query, Resolver } from "type-graphql";

@Resolver()
export class NoteResolver {
  @Query(() => String)
  hello() {
    return "world";
  }
}
