import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { HttpException, HttpStatus } from '@nestjs/common';


describe('WalletController', () => {
  let controller: WalletController;
  let service: WalletService;


  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [{
        provide: WalletService,
        useValue: {
          addWallet: jest.fn( () => ( { 
            address: '0xtesingWallet1',
            isOld: false,
            ethBalance: 2
          } ) ),
          getWallets: jest.fn( () => ( [
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
          changeFavStateForWallet: jest.fn( () => ( { 
            n: 1, 
            nModified: 1, 
            ok: 1 
          } ) ),
        },
      },]
    }).compile();
    

    controller = module.get<WalletController>(WalletController);
    service = module.get<WalletService>(WalletService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it( 'should get a list of wallets', async () => {
    const result = await controller.getWallets();
    expect( result ).toEqual([
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
    ])
    expect( service.getWallets ).toHaveBeenCalled()
  })

  it( 'shoud call addWallet and get the wallet data', async () => {
    const walletAddress = '0xtesingWallet1'
    const result = await controller.addAWalletByAddress(walletAddress);

    expect( result ).toMatchObject({
      address: '0xtesingWallet1',
      isOld: false,
      ethBalance: 2
    })

    expect( service.addWallet ).toHaveBeenCalledWith(walletAddress)
  })

  it( 'should call changeFavStateForWallet with wallet address and favState and return update operation result from mongoose', async () => {
    const address = '0xtesingWallet1';
    const requestBody = { isFav: true};
    const result = await controller.changeFavStateForWallet(requestBody, address);

    expect( result ).toMatchObject( { n: 1, nModified: 1, ok: 1 } );
    expect( service.changeFavStateForWallet ).toHaveBeenCalledWith( address, true)
  })


});
