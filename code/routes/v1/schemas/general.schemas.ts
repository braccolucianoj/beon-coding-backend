import * as yup from 'yup';

export const GeneralYupOptions = {
  strict: false,
  abortEarly: false,
  stripUnknown: true,
  recursive: true,
};

export const requiredPropertyMsg = (prop: string) => `The proparty '${prop}' is missing and is required `;

export const validatorCompiler = ({ schema }) => (data) => {
  try {
    const result = schema.validateSync(data, GeneralYupOptions);
    return { value: result };
  } catch (e) {
    return { error: e };
  }
};
