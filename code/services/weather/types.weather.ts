import { AxiosResponse } from 'axios';

export interface LocationSearch {
  locationType: string;
  whereOnEarthID: Number;
  latitude: Number;
  longitude: Number;
}

export interface LocationSearchAPI {
  title: string;
  location_type: string;
  latt_long: string;
  woeid: Number;
  distance?: Number;
}

export type LocationResponse = AxiosResponse<LocationSearch>;

export interface LocationInfoGet {
  weatherStateDescription: string;
  weatherStateName: string;
  windSpeed: string;
  windDirection: string;
  windDirectionCompass;
  maxTemperature: Number;
  minTemperature: Number;
  averageTemperature: Number;
  airPressure: Number;
  humidity: Number;
  visibility: Number;
  predictability: Number;
}

export interface LocationInfoAPI {
  consolidated_weather: {
    weather_state_abbr: string;
    weather_state_name: string;
    wind_speed: string;
    wind_direction: string;
    wind_direction_compass;
    max_temp: Number;
    min_temp: Number;
    the_temp: Number;
    air_pressure: Number;
    humidity: Number;
    visibility: Number;
    predictability: Number;
  }[];
}

export type LocationInfoResponse = AxiosResponse<LocationInfoGet>;
