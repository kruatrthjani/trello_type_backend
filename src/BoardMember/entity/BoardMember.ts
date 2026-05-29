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
export class BoardClass {

  @Field()
  boardId: string;

  @Field(() => [BoardMemberClass])
  members: BoardMemberClass[];
}


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
export class GetBoardMembersResponse {

  @Field()
  message: string;

  @Field(() => BoardClass)
  data: BoardClass;
}

@ObjectType()
export class BoardMemberResponse {
  @Field()
  message: string;

  @Field(() => BoardMemberClass)
  data: BoardMemberClass;
}
