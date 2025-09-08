import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

enum ShippingMethod {
  byKm = 'by-km',
  citiesAndZones = 'cities-and-zones',
}

export class CoordsDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class ClientDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordsDto)
  coords?: CoordsDto;
}

export class SenderDto {
  @ValidateNested()
  @Type(() => CoordsDto)
  @IsNotEmpty()
  coords: CoordsDto;
}

class ZoneDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  price: number;
}

export class CityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => ZoneDto)
  @IsOptional()
  zone: ZoneDto;
}

export class CreateShippingDto {
  @ValidateNested()
  @Type(() => ClientDto)
  @IsOptional()
  client: ClientDto;

  @ValidateNested()
  @Type(() => SenderDto)
  @IsOptional()
  sender: SenderDto;

  @ValidateNested()
  @Type(() => CityDto)
  @IsOptional()
  city: CityDto;

  @IsOptional()
  @IsEnum(ShippingMethod)
  shippingMethod: string;

  @IsOptional()
  @IsNumber()
  price_by_km?: number;

  @IsOptional()
  @IsNumber()
  discount_porcent: number;

  @IsOptional()
  @IsNumber()
  insurance_porcentage?: number;
}
