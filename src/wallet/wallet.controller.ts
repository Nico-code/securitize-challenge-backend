import { Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { IWallet } from './interfaces/wallet';

@Controller('wallet')
export class WalletController {

  constructor(
    private walletService: WalletService
  ){}

  @Post(':address')
  async getWalletData( @Param('address') address): Promise<{ethBalance: number, isOld: boolean, address: string}> {
    return await this.walletService.addWallet(address)
  }

  @Get()
  async getWallets() {
    return await this.walletService.getWallets()
  }

}
