import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardIn {
  @Field((type) => String)
  title!: string;

  @Field((type) => String)
  content!: string;

  @Field((type) => String)
  userName!: string;
}

@InputType()
export class UpdateBoardIn {
  @Field((type) => String, { nullable: true })
  title?: string;

  @Field((type) => String, { nullable: true })
  content?: string;

  @Field((type) => Number)
  boardId!: number;

  @Field((type) => String)
  userName!: string;
}

@InputType()
export class DeleteBoardIn {
  @Field((type) => Number)
  boardId!: number;

  @Field((type) => String)
  userName!: string;
}

@InputType()
export class searchBoardIn {
  @Field((type) => Number)
  boardId!: number;
}
