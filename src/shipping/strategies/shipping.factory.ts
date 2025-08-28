import { ByKmImplement } from './implements/by-km.implement';
import { IQuoteShipping } from '../interfaces/quote-shipping.interface';
import { CitiesAndZonesImplement } from './implements/cities-and-zones.implement';

export class QuoteShippingFactory {
  static createPaymentGateway(shippingMethod: string): IQuoteShipping {
    switch (shippingMethod.toLowerCase()) {
      case 'by-km':
        return new ByKmImplement();

      default:
        return new CitiesAndZonesImplement();
    }
  }
}
