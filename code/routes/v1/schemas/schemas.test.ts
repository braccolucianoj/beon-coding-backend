import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { TESTING_URL } from '../../../testing';

import { userSchema, loginSchema } from './account.schemas';
import { flightParamSchema, flightSchema, flightPersonParamsSchema, flightUpdateSchema } from './flight.schemas';
import { personSchema } from './person.schemas';
import { GeneralYupOptions } from './general.schemas';

chai.use(chaiHttp);
const { expect } = chai;

describe('Testing schemas ', () => {
  [
    // USER
    {
      name: 'ACCOUNT',
      schema: userSchema,
      testCases: [
        {
          name: 'Valid account',
          value: {
            password: 'password123',
            email: 'testing@test.com',
            firstName: 'First name',
            lastName: 'Last Name',
            phone: '3442412131',
          },
          result: true,
        },
      ],
    },
    // LOGIN
    {
      name: 'LOGIN',
      schema: loginSchema,
      testCases: [
        {
          name: 'Valid login',
          value: {
            password: 'password123',
            email: 'testing@test.com',
          },
          result: true,
        },
      ],
    },

    // FLIGHT CREATE
    {
      name: 'FLIGHT CREATE',
      schema: flightSchema,
      testCases: [
        {
          name: 'Valid flight',
          value: {
            flightDate: new Date(Date.now()),
            origin: 'london',
            destination: 'san francisco',
            price: 12,
          },
          result: true,
        },
      ],
    },
    // FLIGHT PARAM
    {
      name: 'FLIGHT PARAM',
      schema: flightParamSchema,
      testCases: [
        {
          name: 'valid flightId',
          value: { flightId: 1231 },
          result: true,
        },
        {
          name: 'flightId has wrong type',
          value: { flightId: { value: 1 } },
          result: false,
        },
        {
          name: 'no flightId given',
          value: {},
          result: false,
        },
      ],
    },
    // FLIGHT-PERSON PARAM
    {
      name: 'FLIGHT PERSON PARAM',
      schema: flightPersonParamsSchema,
      testCases: [
        ,
        {
          name: 'valid flight person',
          value: {
            flightId: 1,
            personId: 1,
          },
          result: true,
        },
        {
          name: 'flightId has wrong type',
          value: { flightId: { value: 1 } },
          result: false,
        },
        {
          name: 'no flightId given',
          value: {},
          result: false,
        },
      ],
    },
    // FLIGHT UPDATE
    {
      name: 'FLIGHT UPDATE',
      schema: flightUpdateSchema,
      testCases: [
        {
          name: 'Valid Flight update',
          value: { price: 13 },
          result: true,
        },
      ],
    },
  ].forEach(({ name: suiteName, schema, testCases }) => {
    describe(`${suiteName} Schemas`, () => {
      testCases.forEach(({ name: testName, value, result }) => {
        it(`Testing ${testName}`, () => {
          expect(schema.isValidSync(value, GeneralYupOptions)).to.equal(result);
        });
      });
    });
  });
});
