import { CreateShippingDto } from "../dto/create-shipping.dto";

export interface IQuoteShipping {
    quoteShipping(createShippingDto: CreateShippingDto): any;
}