import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseOutDto {
  // 성공여부
  @Field((type) => Boolean)
  done: boolean;

  // 정상 동작 메세지
  @Field((type) => String, { nullable: true })
  message?: string;

  // 에러 메세지
  @Field((type) => String, { nullable: true })
  error?: string;

  // 내부 에러코드
  @Field((type) => String, { nullable: true })
  code?: string;
}
