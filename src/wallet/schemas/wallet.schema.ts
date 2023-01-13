import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema()
export class Wallet {
  @Prop()
  address: string;

  @Prop()
  isOld: boolean;

  @Prop()
  ethBalance: number;

  @Prop()
  isFav: boolean

}

export const WalletSchema = SchemaFactory.createForClass(Wallet);