import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { Wallet } from './schemas/wallet.schema';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { Model } from 'mongoose';


describe('WalletService', () => {
  let service: WalletService;
  let model: Model<Wallet>;

  const testingAPI_KEY = 'testing_env_variable'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService, 
        {
          provide: getModelToken(Wallet.name),
          useValue: {
            find: jest.fn()
              .mockImplementationOnce( () => Promise.resolve([]) )
              .mockImplementation( () => Promise.resolve( [
                {
                  address: '0xtesingWallet1',
                  isOld: false,
                  ethBalance: 2
                },
                {
                  address: '0xtesingWallet2',
                  isOld: false,
                  ethBalance: 1
                }
              ] ) ),
            findOne: jest.fn()
              .mockImplementation( (walletToAdd: { address: string }) => {
                
                if(walletToAdd.address === '0xtesingWallet1'){
                  return Promise.resolve( {
                    address: '0xtesingWallet1',
                    isOld: false,
                    ethBalance: 2
                  } )
                } else {
                  return Promise.resolve( null )
                }                
              } ),
            create: jest.fn()
              .mockImplementation( () => Promise.resolve( true ) ),
            updateOne: jest.fn()
              .mockImplementation( () => Promise.resolve( { success: true } ) )
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn( () => testingAPI_KEY)
          }
        }
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    model = module.get<Model<Wallet>>(getModelToken(Wallet.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it( 'should return an empty array if no wallet was added and a wallets list with eth balances when records exist', async () => {
    
    const firstCallResult = await service.getWallets();

    jest.spyOn( axios, 'get')
      .mockImplementation( () => Promise.resolve( {
        data: {
          result: [
            {"account":"0xtesingWallet1","balance":"10000000000000000000"},
            {"account":"0xtesingWallet2","balance":"20000000000000000000"}
          ]
        }
      } ) )

    const secondCallResult = await service.getWallets();

    expect( firstCallResult ).toMatchObject( [] )

    expect( secondCallResult ).toMatchObject( [
      {
        address: '0xtesingWallet1',
        isOld: false,
        ethBalance: 10
      },
      {
        address: '0xtesingWallet2',
        isOld: false,
        ethBalance: 20
      }
    ] )

    expect( axios.get ).toHaveBeenCalledWith(`https://api.etherscan.io/api?module=account&action=balancemulti&address=0xtesingWallet1,0xtesingWallet2&tag=latest&apikey=${testingAPI_KEY}`)

  })

  it( 'should throw an error when the address exists in database', async () => {

    try {
      await service.addWallet('0xtesingWallet1')
    } catch( e ) {
      expect( e.response ).toBe('Address already added');
      expect( e.status ).toBe(409);
    }

  } )

  it( 'should add the wallet to database and return its data', async () => {

    const addressToAdd = '0xtesingWallet2'

    jest.spyOn( axios, 'get')
      .mockImplementation( (url: string) => {
        if(url === `https://api.etherscan.io/api?module=account&action=balance&address=${addressToAdd}&tag=latest&apikey=${testingAPI_KEY}`){
          return Promise.resolve({
            data: {
              result: "20000000000000000000"
            }
          })
        } else {
          return Promise.resolve( {
            data: {
              result: [{"blockNumber":"11236636","timeStamp":"1602847799","hash":"0xcf01a4be4826ab379a93bd7ed7a67fb639f9b6a67dd9b462e582fd3b1e3ea26e","nonce":"3015323","blockHash":"0xb0bf336513ac26182c4d5da7cq34fcf0d72a425d59ad6e9e7ase41f9f99c60cb53","transactionIndex":"176","from":"0xtesingWallet2","to":"0xtesingWallet1","value":"45000000000000000","gas":"21000","gasPrice":"74000000000","isError":"0","txreceipt_status":"1","input":"0x","contractAddress":"","cumulativeGasUsed":"9006741","gasUsed":"21000","confirmations":"5346455","methodId":"0x","functionName":""}]
            }
          } )
        }
      } )

    const result = await service.addWallet(addressToAdd);

    expect( result ).toMatchObject( {
      address: addressToAdd,
      isOld: true,
      ethBalance: 20
    } )

    expect( axios.get ).toHaveBeenCalled();
    expect( model.create ).toHaveBeenCalledWith( expect.objectContaining( {
      address: addressToAdd,
      isOld: true,
      ethBalance: 20
    } ) )
    
  } )

  it( 'should change isFav property of the wallet document', async () => {

    const walletAddress = '0xtesingWallet2'
    const isFav = true

    await service.changeFavStateForWallet( walletAddress, isFav)

    expect( model.updateOne ).toHaveBeenCalledWith( 
      expect.objectContaining( { 
        address: walletAddress
       } ), 
      expect.objectContaining( { 
        $set: { isFav } 
      } ) )

  } )

});
