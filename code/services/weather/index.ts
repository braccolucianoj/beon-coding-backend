import BaseAxios from 'axios';
import {
  LocationInfoAPI,
  LocationInfoGet,
  LocationSearch,
  LocationSearchAPI,
  LocationResponse,
  LocationInfoResponse,
} from './types.weather';
import { WeatherError } from './WeatherError';

const BASE_URL = 'https://www.metaweather.com/api';

const axios = BaseAxios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const getWeather = async (place: string) => {
  let information: LocationInfoGet, location: LocationSearch;
  try {
    location = await searchLocation(place.toLowerCase());
    information = await getLocationInformation(location);
  } catch (err) {
    throw new WeatherError(err);
  }
  if (location.whereOnEarthID) {
    return { data: { ...information, ...location } };
  } else {
    throw new WeatherError();
  }
};

const searchLocation = async (place: string): Promise<LocationSearch> => {
  const result = await axios.get<any, LocationResponse>(`/location/search/?query=${place}`, {
    transformResponse: [...(BaseAxios.defaults.transformResponse as []), transformLocationSearch],
  });
  return result.data;
};

const getLocationInformation = async ({ whereOnEarthID }: LocationSearch): Promise<LocationInfoGet> => {
  const result = await axios.get<any, LocationInfoResponse>(
    `/location/${whereOnEarthID}/
  `,
    {
      transformResponse: [...(BaseAxios.defaults.transformResponse as []), transformLocationWeather],
    }
  );
  return result.data;
};

const transformLocationSearch = (response: LocationSearchAPI[] = []): LocationSearch => {
  // Taking first value. If fails then we mask the error
  const value = response[0];
  const [latitude, longitude] = `${value.latt_long}`.split(',');
  return {
    locationType: value.location_type,
    whereOnEarthID: value.woeid,
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
};

const transformLocationWeather = (response: LocationInfoAPI): LocationInfoGet => {
  // Taking first value. If fails then we mask the error
  const { consolidated_weather } = response;
  const value = consolidated_weather[0];
  return {
    weatherStateDescription: value.weather_state_abbr,
    weatherStateName: value.weather_state_name,
    windSpeed: value.wind_speed,
    windDirection: value.wind_direction,
    windDirectionCompass: value.wind_direction_compass,
    maxTemperature: value.max_temp,
    minTemperature: value.min_temp,
    averageTemperature: value.the_temp,
    airPressure: value.air_pressure,
    humidity: value.humidity,
    visibility: value.visibility,
    predictability: value.predictability,
  };
};
