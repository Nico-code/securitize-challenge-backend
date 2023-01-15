import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRatesService } from './exchange-rates.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

describe('ExchangeRatesService', () => {
  let service: ExchangeRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRatesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn( () => 'testing_env_variable')
          }
        }
      ],
    }).compile();

    service = module.get<ExchangeRatesService>(ExchangeRatesService);

    jest.spyOn( axios, 'get')
      .mockImplementation( url => {
        if(url === 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=testing_env_variable'){
          return Promise.resolve( {
            data: {
              result : {
                ethusd: "1400",
                ethusd_timestamp: "1673764333",
              }
            }
          } )
        } else {
          return Promise.resolve( {
            data: {
              EUR: 1500,
            }
          } )
        }
      })
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it( 'should call endpoints to get data and return it', async () => {
    const result = await service.getEthExchangeRates()

    expect( result ).toMatchObject( {
      eth_usd: 1400,
      eth_usd_timestamp: '15 Jan 2023 - 03:32',
      eth_eur: 1500,
      eth_eur_timestamp: expect.any( String )
    } )

    expect( axios.get ).toHaveBeenCalledTimes(2)
  })
});
