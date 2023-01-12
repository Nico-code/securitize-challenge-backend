import { Controller, Get } from '@nestjs/common';
import { ExchangeRatesService } from './exchange-rates.service';

@Controller('exchange-rates')
export class ExchangeRatesController {

  constructor(
    private exchangeRatesService: ExchangeRatesService,
  ){}

  @Get('/eth')
  async getExchangeRatesETH_USDAndETH_EUR(): Promise<{eth_usd: number, eth_usd_timestamp: string, eth_eur: number, eth_eur_timestamp: string}>  {
    return this.exchangeRatesService.getEthExchangeRates()
  }
  
}
