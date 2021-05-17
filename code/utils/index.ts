import * as fs from 'fs';

import { IJWTSecretConfig } from '../config/types.config';

export const loadSecrets = (secrets: IJWTSecretConfig): any => {
  const { passphrase, privateKeyPath, publicKeyPath } = secrets;
  const publicKey = fs.readFileSync(publicKeyPath);
  const key = fs.readFileSync(privateKeyPath);
  return { private: { passphrase, key }, public: publicKey };
};

export const loadPrivateKey = (secrets: IJWTSecretConfig) => {
  const { passphrase, privateKeyPath } = secrets;
  return { passphrase, key: fs.readFileSync(privateKeyPath) };
};
