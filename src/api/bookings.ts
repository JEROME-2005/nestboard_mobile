import {
  apiClient,
} from './apiClient';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED';

export type Booking = {
  id: string;

  seatIndex: number;

  leaseStart: string;

  leaseEnd: string;

  duration: number;

  totalAmount: number;

  status: BookingStatus;

  paymentStatus: PaymentStatus;

  createdAt: string;

  room: {
    id: string;

    name: string;

    roomType: {
      id: string;

      name: string;

      pricePerMonth: string;

      property: {
        id: string;

        title: string;

        city?: string;

        imageUrl?: string;
      };
    };
  };
};

const normalizeBooking = (
  booking: any,
): Booking => {
  return {
    id: booking.id,

    seatIndex:
      booking.seatNumber,

    leaseStart:
      booking.leaseStart,

    leaseEnd:
      booking.leaseEnd,

    duration:
      booking.durationMonths,

    totalAmount:
      Number(
        booking.totalAmount,
      ),

    status:
      booking.bookingStatus,

    paymentStatus:
      booking.paymentStatus,

    createdAt:
      booking.createdAt,

    room: {
      id:
        booking.room.id,

      name:
        booking.room.roomLabel ??
        booking.room.name ??
        '',

      roomType: {
        id:
          booking.room.roomType.id,

        name:
          booking.room.roomType.name,

        pricePerMonth:
          String(
            booking.room.roomType
              .pricePerMonth,
          ),

        property: {
          id:
            booking.room.roomType
              .property.id,

          title:
            booking.room.roomType
              .property.title,

          city:
            booking.room.roomType
              .property.city,

          imageUrl:
            booking.room.roomType
              .property.imageUrl,
        },
      },
    },
  };
};

export const BookingAPI = {
  createBooking:
    async (
      roomId: string,
      seatIndex: number,
      startMonth: string,
      durationMonths: number,
    ): Promise<Booking> => {
      const response =
        await apiClient.post(
          'bookings',
          {
            roomId,

            seatNumber:
              seatIndex,

            startMonth,

            durationMonths,
          },
        );

      return normalizeBooking(
        response.data,
      );
    },

  confirmBooking:
    async (
      bookingId: string,
    ): Promise<Booking> => {
      const response =
        await apiClient.post(
          `bookings/${bookingId}/confirm`,
        );

      return normalizeBooking(
        response.data,
      );
    },

  cancelBooking:
    async (
      bookingId: string,
    ): Promise<Booking> => {
      const response =
        await apiClient.post(
          `bookings/${bookingId}/cancel`,
        );

      return normalizeBooking(
        response.data,
      );
    },

  getMyBookings:
    async (): Promise<Booking[]> => {
      const response =
        await apiClient.get<any[]>(
          'bookings/my',
        );

      return response.data.map(
        normalizeBooking,
      );
    },
};