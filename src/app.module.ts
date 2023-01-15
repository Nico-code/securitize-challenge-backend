import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { ExchangeRatesController } from './exchange-rates/exchange-rates.controller';
import { ExchangeRatesService } from './exchange-rates/exchange-rates.service';
import { ExchangeRatesModule } from './exchange-rates/exchange-rates.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot( {
      isGlobal: true,
    } ),
    MongooseModule.forRoot( process.env.DATA_BASE_URI ),
    WalletModule,
    ExchangeRatesModule
 ],
  controllers: [ExchangeRatesController],
  providers: [ExchangeRatesService],
  exports: [MongooseModule]
})
export class AppModule {}