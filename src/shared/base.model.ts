import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  @PrimaryGeneratedColumn('increment')
  @Field((_) => ID)
  id!: number;

  @CreateDateColumn()
  @Field((_) => Date)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field((_) => Date)
  updatedAt!: Date;

  // @Column({ nullable: true })
  @DeleteDateColumn({ nullable: true })
  @Field((_) => Date, { nullable: true })
  deletedAt?: Date;
}
