import { v7 as uuidv7 } from 'uuid';

export const generateToken = () => {
  return uuidv7();
};
