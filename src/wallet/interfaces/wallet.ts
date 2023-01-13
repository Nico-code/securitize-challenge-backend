import { Types } from 'mongoose';

export interface IWallet {
  _id?: string | Types.ObjectId,
  address: string,
  isOld: boolean,
  ethBalance: number,
  isFav?: boolean,
}