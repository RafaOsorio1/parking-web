import type {
  CashSession as PrismaCashSession,
  ParkingRate as PrismaParkingRate,
  ParkingSpot as PrismaParkingSpot,
  Ticket as PrismaTicket,
  Vehicle as PrismaVehicle,
} from '@rafaosorio/parking-types';

export type VehicleType = 'CAR' | 'MOTORCYCLE';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

export type Vehicle = PrismaVehicle;
export type Spot = PrismaParkingSpot;
export type Rate = PrismaParkingRate;

export type CashSession = PrismaCashSession & {
  _count?: {
    tickets: number;
  };
  currentExpected?: number;
};

export type Ticket = PrismaTicket & {
  vehicle?: Vehicle;
  spot?: Spot;
  rate?: Rate | null;
  cashSession?: CashSession | null;
};
