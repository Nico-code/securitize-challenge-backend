import { Document } from "mongoose"

export interface IWallet {
  _id: any,
  address: string,
  isOld: boolean,
  ethBalance: number
}