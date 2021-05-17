import 'mocha';
import * as chai from 'chai';
import { getWeather } from '.';
import { WeatherError } from './WeatherError';

const { expect } = chai;

describe('Testing Weather service ', () => {
  it('Testing for city: London', async () => {
    const { data } = await getWeather('London');
    expect(data.whereOnEarthID).to.be.a('number');
    expect(data.latitude).to.be.a('number');
    expect(data.longitude).to.be.a('number');
    expect(data.weatherStateName).to.be.a('string');
  });

  it('Testing for non-existent city', async () => {
    try {
      await getWeather('RandomTestingValue');
      expect(1).to.be.undefined;
    } catch (err) {
      expect(err).to.be.instanceOf(WeatherError);
    }
  });
});
