import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardIn {
  @Field((type) => String)
  title!: string;

  @Field((type) => String)
  content!: string;

  @Field((type) => Number)
  user_id!: number;
}

@InputType()
export class UpdateBoardIn {
  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  content?: string;

  @Field((type) => Number)
  board_id!: number;

  @Field((type) => Number)
  user_id!: number;
}

@InputType()
export class DeleteBoardIn {
  @Field((type) => Number)
  board_id!: number;

  @Field((type) => Number)
  user_id!: number;
}
