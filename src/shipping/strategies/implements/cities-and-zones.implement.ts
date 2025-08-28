import { CreateShippingDto } from 'src/shipping/dto/create-shipping.dto';
import { IQuoteShipping } from 'src/shipping/interfaces/quote-shipping.interface';

export class CitiesAndZonesImplement implements IQuoteShipping {
  quoteShipping(createShippingDto: CreateShippingDto): any {
    if (!createShippingDto?.city?.zone?.price)
      throw new Error("Need add city object in your request.");

    return {
      price: createShippingDto?.city?.zone?.price || 0,
    };
  }
}
