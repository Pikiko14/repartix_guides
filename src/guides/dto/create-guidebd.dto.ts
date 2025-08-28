import { IsOptional, IsString } from 'class-validator';

export class CreateGuideDto {
  @IsString()
  order_reference: string;

  @IsString()
  guide_url: string;

  @IsString()
  parent_id: string;

  @IsString()
  @IsOptional()
  status?: string;
}
