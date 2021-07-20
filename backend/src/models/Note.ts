import { Field, ObjectType, ID } from "type-graphql";
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

  @Field(() => String)
  @Column()
  author: string;

  @Field(() => Date)
  @CreateDateColumn()
  dateCreated: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  dateUpdated: Date;
}
