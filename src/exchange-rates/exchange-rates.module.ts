import { Module } from '@nestjs/common';
import { ExchangeRatesController } from './exchange-rates.controller';
import { ExchangeRatesService } from './exchange-rates.service';

@Module({
  imports: [],
  controllers: [ExchangeRatesController],
  providers: [ExchangeRatesService]
})
export class ExchangeRatesModule {}
