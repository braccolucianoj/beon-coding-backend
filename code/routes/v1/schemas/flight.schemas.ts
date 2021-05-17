import * as yup from 'yup';
import { requiredPropertyMsg } from './general.schemas';

export const flightSchema = yup.object({
  flightDate: yup.date().required(requiredPropertyMsg('flightDate')),
  origin: yup.string().required(requiredPropertyMsg('origin')),
  destination: yup.string().required(requiredPropertyMsg('destination')),
  price: yup.number().required(requiredPropertyMsg('price')),
  // crew: yup
  //   .object({
  //     pilot: yup.string().required(requiredPropertyMsg('pilot')),
  //     copilot: yup.string().required(requiredPropertyMsg('copilot')),
  //     flightAttendant: yup.array(yup.string()).required(),
  //   })
  //   .required(requiredPropertyMsg('crew')),
});

export const flightUpdateSchema = yup
  .object({
    flightDate: yup.date(),
    origin: yup.string(),
    destination: yup.string(),
    price: yup.number(),
    // crew: yup.object({
    //   pilot: yup.string().required(requiredPropertyMsg('pilot')),
    //   copilot: yup.string().required(requiredPropertyMsg('copilot')),
    //   flightAttendant: yup.array(yup.string()).required(),
    // }),
  })
  .test('data-given', 'At least provide one property to be changed', (value) =>
    [
      // // Commented values should be updatable
      // value.flightDate,
      // value.origin,
      // value.destination,
      value.price,
      // value.crew
    ].some((x) => x)
  );

export const flightParamSchema = yup.object({
  flightId: yup.number().required(`No flight's id was given. Please provide one`),
});

export const flightPersonParamsSchema = yup.object({
  flightId: yup.number().required(`No flight's id was given. Please provide one`),
  personId: yup.number(),
});
