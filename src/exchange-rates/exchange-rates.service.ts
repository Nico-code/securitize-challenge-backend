import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as moment from 'moment'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExchangeRatesService {

  constructor(
    private configService: ConfigService
  ){}

  async getEthExchangeRates() {

    const apiKey = this.configService.get<string>( 'ETHERSCAN_API_KEY' );
    
    const [ETH_USD_response, ETH_EUR] = await Promise.all([
      axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${apiKey}`),
      axios.get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR`),
    ])

    const ETH_USD = ETH_USD_response.data.result;

    return {
      eth_usd: parseFloat(ETH_USD.ethusd || 0),
      eth_usd_timestamp: moment.unix(parseInt(ETH_USD.ethusd_timestamp)).format('DD MMM YYYY - HH:mm'),
      eth_eur: ETH_EUR.data?.EUR  || 0,
      eth_eur_timestamp: moment().format('DD MMM YYYY - HH:mm'),
    }
  }

}