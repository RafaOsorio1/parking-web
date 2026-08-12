import type {
  Prisma,
  PrismaRate,
  PrismaSpot,
  PrismaVehicle,
} from '@rafaosorio/parking-types';

export type VehicleType = 'CAR' | 'MOTORCYCLE';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message?: string;
}

export type Vehicle = PrismaVehicle;
export type Spot = PrismaSpot;
export type Rate = PrismaRate;
export type CashSession = Prisma.CashSessionGetPayload<{
  include: {
    _count?: {
      select: { tickets: true };
    };
  };
}> & {
  currentExpected?: number;
  openedByName?: string;
  closedByName?: string;
};

export type Ticket = Prisma.TicketGetPayload<{
  include: {
    vehicle: true;
    spot: true;
    rate: true;
    cashSession?: true;
  };
}>;
