import ky from 'ky';

const API_URL = import.meta.env.VITE_API_URL;

export const httpClient = ky.create({
  prefix: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
