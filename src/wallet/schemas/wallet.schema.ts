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
  ethBalance: Number

}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document  } from 'mongoose';

// @Schema()
// export class Wallet extends Document {

//     @Prop()
//     address: string;

//     @Prop()
//     isOld: boolean;

//     @Prop()
//     ethBalance: Number
// }

// export const WalletSchema = SchemaFactory.createForClass(Wallet)

// import { Schema } from 'mongoose';

// export const WalletSchema = new Schema({
//   address: String,
//   isOld: Boolean,
//   ethBalance: Number
// })