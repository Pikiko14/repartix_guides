import { CreateShippingDto } from 'src/shipping/dto/create-shipping.dto';
import { IQuoteShipping } from 'src/shipping/interfaces/quote-shipping.interface';

export class ByKmImplement implements IQuoteShipping {
  /**
   * Calcula el costo del envio
   * @param { CreateShippingDto } createShippingDto 
   * @returns { any }
   */
  quoteShipping(createShippingDto: CreateShippingDto): any {
    if (!createShippingDto.sender)
      throw new Error("Please configure sender object in your request");

    if (!createShippingDto.client)
      throw new Error("Please configure client object in your request");

    if (!createShippingDto.sender.coords.lat)
      throw new Error("Please configure sender lat in your request");

    if (!createShippingDto.sender.coords.lng)
      throw new Error("Please configure sender lng in your request");

    if (!createShippingDto.client.coords.lat)
      throw new Error("Please configure client lat in your request");

    if (!createShippingDto.client.coords.lng)
      throw new Error("Please configure client lng in your request")


    const distance = this.calculateDistance(
      createShippingDto.sender.coords.lat,
      createShippingDto.sender.coords.lng,
      createShippingDto.client.coords.lat,
      createShippingDto.client.coords.lng,
    );
    return {
      distance: parseFloat(distance.toFixed(2)),
      price: parseFloat(distance.toFixed(2)) * createShippingDto.price_by_km
    };
  }

  /**
   * Calcula la distancia en kilómetros entre dos coordenadas
   * @param lat1 Latitud del punto 1
   * @param lon1 Longitud del punto 1
   * @param lat2 Latitud del punto 2
   * @param lon2 Longitud del punto 2
   * @returns { number } Distancia en kilómetros
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
