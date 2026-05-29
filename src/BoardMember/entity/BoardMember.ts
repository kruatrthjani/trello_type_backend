import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum RoleType {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
  CLIENT = 'CLIENT',
}

registerEnumType(RoleType, {
  name: 'RoleType',
});

@ObjectType()
export class BoardMemberClass {
  @Field()
  id: string;

  @Field()
  userId: string;

  // @Field(() => RoleType)
  // role: RoleType;
}


@ObjectType()
export class UpdateBoardMemberResponse {
  @Field()
  message: string;

  @Field(() => BoardMemberClass)
  data: BoardMemberClass;
}
