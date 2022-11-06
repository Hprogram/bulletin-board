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
