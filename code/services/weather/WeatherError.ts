export class WeatherError extends Error {
  public parentName: string;

  constructor(err?: Error) {
    if (err) {
      const error = err as Error;
      super(error.message);
      this.stack = error.stack;
      this.parentName = error.name;
      this.name = 'WeatherError';
    } else {
      const message = 'No location found';
      super(message);
      this.name = 'WeatherError';
    }
  }
}
