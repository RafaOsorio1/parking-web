import type { ParkingSpot } from '@rafaosorio/parking-types';

import { httpClient } from '../libs/api';
import type { ApiResponse } from '../libs/types';

export interface CreateBatchSpotsPayload {
  type: 'CAR' | 'MOTORCYCLE';
  count: number;
  isAccessible?: boolean;
}

export class SpotsServices {
  private constructor() {}

  static async getSpots(): Promise<ParkingSpot[]> {
    const response = await httpClient
      .get('spots')
      .json<ApiResponse<ParkingSpot[]>>();

    return response.data;
  }

  static async createSpotsBatch(
    payload: CreateBatchSpotsPayload,
  ): Promise<ParkingSpot[]> {
    const response = await httpClient
      .post('spots', { json: payload })
      .json<ApiResponse<ParkingSpot[]>>();

    return response.data;
  }

  static async updateSpot(
    id: string,
    payload: Partial<ParkingSpot>,
  ): Promise<ParkingSpot> {
    const response = await httpClient
      .put(`spots/${id}`, { json: payload })
      .json<ApiResponse<ParkingSpot>>();

    return response.data;
  }
}
