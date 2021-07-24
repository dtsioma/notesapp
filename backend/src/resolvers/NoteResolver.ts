import {
  Arg,
  Query,
  Resolver,
  Mutation,
  ObjectType,
  Field,
  Int,
  ID,
  Ctx,
} from "type-graphql";
import { Note } from "../models/Note";

@ObjectType()
class DeleteResponse {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field(() => Int)
  authorId: number;
}

@ObjectType()
class UpdateResponse {
  @Field()
  title: string;

  @Field()
  text: string;

  @Field()
  dateCreated: string;

  @Field()
  dateUpdated: string;
}

@Resolver()
export class NoteResolver {
  // return hello
  @Query(() => String)
  hello() {
    return "world";
  }

  // get all notes
  @Query(() => [Note])
  notes() {
    return Note.find();
  }

  // create note
  @Mutation(() => Boolean)
  async createNote(
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Ctx() { req }: any
  ) {
    try {
      const authorId = req.userId;
      const note = Note.create({ title, text, authorId });
      await note.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // get note by id
  @Query(() => Note)
  async noteById(@Arg("id") id: string) {
    const note = await Note.findOne({ where: { id } });
    if (!note) {
      throw new Error("Note not found");
    }
    return note;
  }

  // get notes from author
  @Query(() => [Note])
  async notesByAuthor(@Ctx() { req }: any) {
    const notes = await Note.find({ where: { authorId: req.userId } });
    if (!notes) {
      throw new Error("Notes not found");
    }
    return notes;
  }

  // update note
  @Mutation(() => UpdateResponse)
  async updateNote(
    @Arg("id") id: string,
    @Arg("title", { nullable: true }) title: string,
    @Arg("text", { nullable: true }) text: string
  ) {
    let note = await Note.findOne({ where: { id } });
    if (!note) {
      throw new Error("Note not found");
    }
    if (title) {
      note.title = title;
    }
    if (text) {
      note.text = text;
    }
    await note.save();
    return {
      title: note.title,
      text: note.text,
      dateCreated: note.dateCreated,
      dateUpdated: note.dateUpdated,
    };
  }

  // delete note
  @Mutation(() => Boolean)
  async deleteNote(@Arg("id") id: string) {
    let note = await Note.findOne({ where: { id } });
    if (!note) {
      throw new Error("Note not found");
    }
    try {
      await Note.delete({ id });
      return true;
    } catch {
      return false;
    }
  }
}
