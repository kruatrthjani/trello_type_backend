import {
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
  IsOptional,
} from "class-validator";

export enum Ptype {
  CLIENT = "client",
  INHOUSE = "inhouse",
}

export class ProjectDto {
  @IsString()
  @IsNotEmpty()
  readonly projectName: string;

  @IsString()
  @IsOptional()
  readonly category?: string;

  @IsString()
  @IsNotEmpty()
  readonly projectOrigin: string;

  @IsEnum(Ptype)
  @IsNotEmpty()
  readonly projectType: Ptype;

  @ValidateIf((o) => o.projectType === Ptype.CLIENT)
  @IsString()
  @IsNotEmpty()
  readonly clientName?: string;

  @IsString()
  @IsNotEmpty()
  readonly projectManager: string;

  @IsString()
  @IsNotEmpty()
  readonly estimatedDuration: string;
}