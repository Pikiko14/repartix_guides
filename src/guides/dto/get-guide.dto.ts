import { IsString } from "class-validator";

export class GetGuideDto {
  @IsString()
  reference: string;

  @IsString()
  parent_id: string;
}
