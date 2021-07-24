import { Field, ObjectType, ID, Int } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class Note extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  text: string;

  @Field(() => Int)
  @Column()
  authorId: number;

  @Field(() => Date)
  @CreateDateColumn()
  dateCreated: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  dateUpdated: Date;
}
