import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-guide.dto';

export class UpdateGuideDto extends PartialType(CreateOrderDto) {
  id: number;
}
