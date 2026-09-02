import ky, { HTTPError } from 'ky';

const API_URL = import.meta.env.VITE_API_URL;

export const httpClient = ky.create({
  prefix: API_URL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeError: [
      async (error: HTTPError) => {
        const { response } = error;
        if (response) {
          try {
            const body = (await response.clone().json()) as { message?: string };
            if (body && body.message) {
              error.message = body.message;
            }
          } catch {
            // Fallback if response body is not JSON
          }
        }
        return error;
      },
    ] as any,
  },
});
