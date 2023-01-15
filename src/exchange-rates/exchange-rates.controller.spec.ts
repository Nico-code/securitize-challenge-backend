import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRatesController } from './exchange-rates.controller';
import { ExchangeRatesService } from './exchange-rates.service';

describe('ExchangeRatesController', () => {
  let controller: ExchangeRatesController;
  let service: ExchangeRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule( {
      controllers: [ExchangeRatesController],
      providers: [{
        provide: ExchangeRatesService,
        useValue: {
          getEthExchangeRates: jest.fn( () => ( {
            eth_usd: 1400,
            eth_usd_timestamp: '15 Jan 2023 - 10:22',
            eth_eur: 1500,
            eth_eur_timestamp: '15 Jan 2023 - 10:22',
          } ) )
        }
      }]
    } ).compile();

    controller = module.get<ExchangeRatesController>(ExchangeRatesController);
    service = module.get<ExchangeRatesService>(ExchangeRatesService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it( 'should call getEthExchangeRates and get the data', async () => {

    const result = await controller.getExchangeRatesETH_USDAndETH_EUR();

    expect( result ).toMatchObject({
      eth_usd: 1400,
      eth_usd_timestamp: '15 Jan 2023 - 10:22',
      eth_eur: 1500,
      eth_eur_timestamp: '15 Jan 2023 - 10:22',
    })

    expect( service.getEthExchangeRates ).toHaveBeenCalled();
  })
  
});
