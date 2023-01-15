import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as moment from 'moment';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema'
import { IWallet } from './interfaces/wallet';


@Injectable()
export class WalletService {

  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    private configService: ConfigService,
  ){}

  async getWallets (): Promise<[]|IWallet[]>{

    const wallets = await this.walletModel.find({});
  
    if(!wallets.length ){
      return [];
    }
    
    const walletsAddresses: string[] = wallets.map( wallet => wallet.address )
    const addressesList: string = walletsAddresses.join(',')

    const apiKey = this.configService.get<string>( 'ETHERSCAN_API_KEY' );

    const balancesResponse = await axios.get(`https://api.etherscan.io/api?module=account&action=balancemulti&address=${addressesList}&tag=latest&apikey=${apiKey}`);

    balancesResponse.data.result.forEach( walletBalanceResult => {
      const index = wallets.findIndex( (wallet) => wallet.address === walletBalanceResult.account);
      const balance = ethers.utils.formatEther(walletBalanceResult.balance)
      wallets[index].ethBalance = parseFloat(balance)
    });

    return wallets
    
  }

  async addWallet( address: string): Promise<IWallet> {

    const addressAlreadyAdded = await this.walletModel.findOne({ address });
    if( addressAlreadyAdded ) {
      throw new HttpException('Address already added', HttpStatus.CONFLICT)
    }

    const apiKey = this.configService.get<string>( 'ETHERSCAN_API_KEY' );

    const [ balanceResponse, transactionsResponse] = await Promise.all( [
      axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`),
      axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=16376689&page=1&offset=10&sort=asc&apikey=${apiKey}`)
    ] )

    let ethBalance = balanceResponse.data.result;
    let firstAccountTransaction = transactionsResponse.data.result[0];

    let isOld = false;
    
    if( firstAccountTransaction ){
      let txTimestamp = firstAccountTransaction.timeStamp;
      let limitDate = moment().subtract(1, 'year');

      isOld = moment( parseInt(txTimestamp) ).isSameOrBefore( limitDate );

    }

    const balance = ethers.utils.formatEther(ethBalance);
    ethBalance = parseFloat(balance)
    await this.walletModel.create({
      address,
      isOld,
      ethBalance
    })

    return { ethBalance, isOld, address }

  }

  async changeFavStateForWallet(address: string, isFav: boolean){
    return await this.walletModel.updateOne({ address }, {$set: { isFav } } );
  }

}
