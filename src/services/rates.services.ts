import type { ParkingRate } from '@rafaosorio/parking-types';

import { httpClient } from '../libs/api';
import type { ApiResponse } from '../libs/types';

export class RatesServices {
  private constructor() {}

  static async getRates(): Promise<ParkingRate[]> {
    const response = await httpClient
      .get('/rates')
      .json<ApiResponse<ParkingRate[]>>();

    return response.data;
  }

  static async createRate(payload: Partial<ParkingRate>): Promise<ParkingRate> {
    const response = await httpClient
      .post('/rates', { json: payload })
      .json<ApiResponse<ParkingRate>>();

    return response.data;
  }

  static async updateRate(
    id: string,
    payload: Partial<ParkingRate>,
  ): Promise<ParkingRate> {
    const response = await httpClient
      .put(`/rates/${id}`, { json: payload })
      .json<ApiResponse<ParkingRate>>();

    return response.data;
  }
}
