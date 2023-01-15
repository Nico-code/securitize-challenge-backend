import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/wallet (GET)', () => {
    return request(app.getHttpServer())
      .get('/wallet')
      .expect(200)
  });

  describe('Add wallet to database /wallet/:address (POST)', () => {

    it('should add 0x947738340Cb419eeAe6F20c2d94388157ca13a22 to database', () => {
      return request(app.getHttpServer())
        .post('/wallet/0x947738340Cb419eeAe6F20c2d94388157ca13a22')
        .expect(201)
    })

    it('should get 409 status code error when try to add the same addess', () => {
      return request(app.getHttpServer())
        .post('/wallet/0x947738340Cb419eeAe6F20c2d94388157ca13a22')
        .expect(409)
    })


  })

  describe('Change isFav propery of a wallet /favorite/:address (PUT)', () => {

    it(' should set to TRUE the isFav propery for wallet document with address 0x947738340Cb419eeAe6F20c2d94388157ca13a22', () => {
      return request(app.getHttpServer())
        .put('/wallet/favorite/0x947738340Cb419eeAe6F20c2d94388157ca13a22')
        .send( { isFav: true } )
        .expect(200)
    } )

  })

  describe('Get exchange rates /exchange-rates/eth (GET)', () => {

    it('should return the exchange rates for eth-usd and eth-eur', () => {
      return request(app.getHttpServer())
        .get('/exchange-rates/eth')
        .expect(200)
        .then( (res) => {
          expect( res.body ).toMatchObject( expect.objectContaining( {            
            eth_usd: expect.any( Number ),
            eth_usd_timestamp: expect.any( String),
            eth_eur: expect.any( Number ),
            eth_eur_timestamp: expect.any( String)            
          } ) )
        } )
    })

  })


});
