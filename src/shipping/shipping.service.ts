import { RpcException } from '@nestjs/microservices';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { CacheService } from 'src/commons/cache/cache.service';
import { QuoteShippingFactory } from './strategies/shipping.factory';

@Injectable()
export class ShippingService {
  public logger = new Logger(ShippingService.name);

  constructor(private readonly cacheService: CacheService) {}

  async create(createShippingDto: CreateShippingDto) {
    try {
      const key = `shipping:price:${JSON.stringify(createShippingDto)}`;
      let shippingPrice = await this.cacheService.getItem(key);
      if (shippingPrice) {
        return {
          ...createShippingDto,
          distance_in_km: shippingPrice?.distance || 0,
          shipping_price: shippingPrice?.price || 0,
          discount_porcent: shippingPrice?.discountPorcent || 0,
          discount_amount: shippingPrice?.discount || 0,
          insurance_amount: shippingPrice?.insurance || 0,
        };
      }

      // logging
      this.logger.verbose(
        `Se inicia la cotizacion para el envio: ${JSON.stringify(createShippingDto)} en la fecha ${new Date().toISOString()}`,
      );

      // hago la cotización
      const shippingQuoteMethod = QuoteShippingFactory.createPaymentGateway(
        createShippingDto.shippingMethod || 'cities-and-zones',
      );
      shippingPrice = shippingQuoteMethod.quoteShipping(createShippingDto);
      this.logger.log(
        `Cotización correcta para el envio: ${JSON.stringify(createShippingDto)} en la fecha ${new Date().toISOString()} y con respuesta: ${JSON.stringify(shippingPrice)}`,
      );

      // save in cache
      await this.cacheService.setItem(key, shippingPrice);

      // return response
      return {
        ...createShippingDto,
        distance_in_km: shippingPrice?.distance || 0,
        shipping_price: shippingPrice?.price || 0,
        discount_porcent: shippingPrice?.discountPorcent || 0,
        discount_amount: shippingPrice?.discount || 0,
        insurance_amount: shippingPrice?.insurance || 0,
      };
    } catch (error) {
      this.logger.error(
        `Error en la cotizacion para el envio: ${JSON.stringify(createShippingDto)} en la fecha ${new Date().toISOString()}`,
      );
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  findAll() {
    return `This action returns all shipping`;
  }
}
