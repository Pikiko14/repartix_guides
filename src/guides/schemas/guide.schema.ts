import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GuidesDocument = Guides & Document;

@Schema({ timestamps: true })
export class Guides {
  @Prop({ required: true, index: true })
  order_reference: string;

  @Prop()
  guide_url: string;

  @Prop()
  parent_id?: string;
}

export const GuideSchema = SchemaFactory.createForClass(Guides);
