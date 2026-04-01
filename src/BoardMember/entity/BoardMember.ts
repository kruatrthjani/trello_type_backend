import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";

export enum RoleType {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}

registerEnumType(RoleType, {
  name: "RoleType",
});

@ObjectType()
export class BoardMemberClass {

  @Field()
  boardId: string;

  @Field()
  userId: string;

  @Field(() => RoleType)
  role: RoleType;
}