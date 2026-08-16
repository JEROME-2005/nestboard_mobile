import { apiClient } from './apiClient';

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

export const BookingAPI = {
  createBooking: async (
    roomId: string,
    seatIndex: number,
    leaseStart: string,
    duration: number,
    total: number,
  ) => {
    const response =
      await apiClient.post<Booking>(
        'bookings',
        {
          roomId,
          seatIndex,
          leaseStart,
          duration,
          total,
        },
      );

    return response.data;
  },

  confirmBooking: async (
    bookingId: string,
  ) => {
    const response =
      await apiClient.post<Booking>(
        `bookings/${bookingId}/confirm`,
      );

    return response.data;
  },

  cancelBooking: async (
    bookingId: string,
  ) => {
    const response =
      await apiClient.post<Booking>(
        `bookings/${bookingId}/cancel`,
      );

    return response.data;
  },

  getMyBookings: async () => {
    const response =
      await apiClient.get<Booking[]>(
        'bookings/my',
      );

    return response.data;
  },

  // Backward-compatible wrapper
  bookProperty: async (
    roomId: string,
    seatIndex: number,
    date: string,
    period: number,
    total: string,
  ) => {
    return BookingAPI.createBooking(
      roomId,
      seatIndex,
      date,
      period,
      parseFloat(total),
    );
  },
};