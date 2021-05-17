import 'mocha';
import '../testing/types';
import * as chai from 'chai';
import { build, main } from '../index';

import { TESTING_URL, createToken } from '../testing';
import { MediaTypes } from '../constants';

chai.use(require('chai-http'));
const { expect } = chai;

const version = 'v1';

describe('Testing Routes ', () => {
  const server = build();

  before((done) => {
    main();
    setTimeout(done, 1000);
  });

  after(() => server.close());

  it('Should create an account and be able to login', async () => {
    const email = `email+${Date.now()}@testing.com`;
    const password = 'Pasword123?1231-';
    const response = await chai
      .request(TESTING_URL)
      .post(`/${version}/signup`)
      .send({
        password,
        email,
        firstName: 'luciano',
        lastName: 'Lastname testing',
        phone: `+12${Date.now()}`,
      });
    expect(response).to.have.status(201);
    const loginResp = await chai.request(TESTING_URL).post(`/${version}/login`).send({ password, email });
    expect(loginResp).to.have.status(204);
    expect(loginResp.header[MediaTypes.AUTHORIZATION]).to.include(MediaTypes.BEARER);
  });

  it('Update password', async () => {
    const email = `email+${Date.now()}@testing.com`;
    const password = 'Pasword123?1231-';
    const response = await chai
      .request(TESTING_URL)
      .post(`/${version}/signup`)
      .send({
        password,
        email,
        firstName: 'luciano',
        lastName: 'Lastname testing',
        phone: `+12${Date.now()}`,
      });
    expect(response).to.have.status(201);
    const loginResp = await chai.request(TESTING_URL).post(`/${version}/login`).send({ password, email });
    expect(loginResp).to.have.status(204);
    // change password
    const newPassword = `${password}-new`;
    const passwordResp = await chai
      .request(TESTING_URL)
      .patch(`/${version}/changePassword`)
      .set(MediaTypes.AUTHORIZATION, loginResp.header[MediaTypes.AUTHORIZATION])
      .send({
        password: newPassword,
      });
    expect(passwordResp).to.have.status(204);
    // login again
    const loginRespNew = await chai
      .request(TESTING_URL)
      .post(`/${version}/login`)
      .send({ password: newPassword, email });
    expect(loginRespNew).to.have.status(204);
  });

  it('Should create a flight', async () => {
    const response = await chai
      .request(TESTING_URL)
      .post(`/${version}/flights`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${createToken()}`)
      .send({ origin: 'london', destination: 'san francisco', price: 1500, flightDate: new Date(Date.now()) });
    expect(response).to.have.status(201);
    expect(response.body.id).to.not.be.null;
    expect(response.body.id).to.not.be.undefined;
  });

  it('Update flight', async () => {
    const token = createToken();
    const response = await chai
      .request(TESTING_URL)
      .post(`/${version}/flights`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${token}`)
      .send({ origin: 'london', destination: 'san francisco', price: 1500, flightDate: new Date(Date.now()) });
    expect(response).to.have.status(201);

    const responseUpdate = await chai
      .request(TESTING_URL)
      .patch(`/${version}/flights/${response.body.id}`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${token}`)
      .send({ price: 1600 });

    expect(responseUpdate).to.have.status(204);

    const newPrice = 1600;
    const responseGet = await chai
      .request(TESTING_URL)
      .get(`/${version}/flight/${response.body.id}`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${token}`)
      .send();
    expect(responseGet).to.have.status(200);
    expect(responseGet.body.id).to.equal(response.body.id);
    expect(responseGet.body.price).to.equal(newPrice);
  });

  it('Delete flight & get it later', async () => {
    const token = createToken();

    const response = await chai
      .request(TESTING_URL)
      .post(`/${version}/flights`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${createToken()}`)
      .send({ origin: 'london', destination: 'san francisco', price: 1500, flightDate: new Date(Date.now()) });
    expect(response).to.have.status(201);

    const responseDelete = await chai
      .request(TESTING_URL)
      .delete(`/${version}/flights/${response.body.id}`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${token}`)
      .send();
    expect(responseDelete).to.have.status(204);
    const responseGet = await chai
      .request(TESTING_URL)
      .get(`/${version}/flight/${response.body.id}`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${token}`)
      .send();
    expect(responseGet).to.have.status(200);
    expect(responseGet.body.id).to.equal(response.body.id);
    expect(responseGet.body.deleted).to.equal(true);
  });

  it('Should create a person & get it', async () => {
    const token = createToken();
    const response = await chai
      .request(TESTING_URL)
      .post(`/${version}/person`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${token}`)
      .send({
        firstName: 'test',
        lastName: 'test',
        identityNumber: Number(`${Date.now()}`.slice(4, 10)),
        birthDate: new Date(Date.now()),
      });
    expect(response).to.have.status(201);
    expect(response.body.id).to.not.be.null;
    expect(response.body.id).to.not.be.undefined;

    const responseGet = await chai
      .request(TESTING_URL)
      .get(`/${version}/person/${response.body.id}`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${token}`)
      .send();
    expect(responseGet).to.have.status(200);
    expect(responseGet.body.id).to.equal(response.body.id);
    expect(responseGet.body.personFlights).to.not.be.null;
    expect(responseGet.body.personFlights).to.not.be.undefined;
  });

  it.only('Add person to flight & get it later', async () => {
    const token = createToken();

    const response = await chai
      .request(TESTING_URL)
      .post(`/${version}/flights`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${createToken()}`)
      .send({ origin: 'london', destination: 'san francisco', price: 1500, flightDate: new Date(Date.now()) });
    expect(response).to.have.status(201);

    const responseAdd = await chai
      .request(TESTING_URL)
      .post(`/${version}/flight/${response.body.id}/add`)
      .set(MediaTypes.AUTHORIZATION, `${MediaTypes.BEARER} ${token}`)
      .send({
        firstName: 'test',
        lastName: 'test',
        identityNumber: Number(`${Date.now()}`.slice(4, 10)),
        birthDate: new Date(Date.now()),
      });
    expect(responseAdd).to.have.status(204);
  });
});
