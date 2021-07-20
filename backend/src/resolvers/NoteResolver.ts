import {
  Arg,
  Query,
  Resolver,
  Mutation,
  ObjectType,
  Field,
} from "type-graphql";
import { Note } from "../models/Note";

@ObjectType()
class DeleteResponse {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  author: string;
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
  @Mutation(() => Note)
  async createNote(
    @Arg("title") title: string,
    @Arg("text") text: string,
    @Arg("author") author: string
  ) {
    const note = Note.create({ title, text, author });
    await note.save();
    return note;
  }

  // get note by id
  @Query(() => Note)
  async getNoteByID(@Arg("id") id: string) {
    const note = await Note.findOne({ where: { id } });
    if (!note) {
      throw new Error("Note not found");
    }
    return note;
  }

  // get notes from author
  @Mutation(() => [Note])
  async getNotesFromAuthor(@Arg("author") author: string) {
    const notes = await Note.find({ where: { author } });
    if (!notes) {
      throw new Error("Notes not found");
    }
    return notes;
  }

  // update note
  @Mutation(() => Note)
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
    return note;
  }

  // delete note
  @Mutation(() => DeleteResponse)
  async deleteNote(@Arg("id") id: string) {
    let note = await Note.findOne({ where: { id } });
    if (!note) {
      throw new Error("Note not found");
    }
    await Note.delete({ id });
    return {
      title: note.title,
      author: note.author,
      id: note.id,
    };
  }
}
