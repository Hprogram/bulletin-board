import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserIn {
  @Field((type) => String)
  name!: string;
}

@InputType()
export class DeleteUserIn {
  @Field((type) => Number)
  id!: number;
}
