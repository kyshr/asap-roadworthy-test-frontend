import api from "../api";
import { IBooking } from "@/types";

interface CreateBookingRequest {
  serviceType: string;
  description?: string;
  scheduledDate?: string;
  location?: string;
}

interface UpdateBookingRequest {
  serviceType?: string;
  description?: string;
  scheduledDate?: string;
  location?: string;
  status?: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
}

interface UpdateStatusRequest {
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
}

interface BookingsResponse {
  success: boolean;
  data: {
    bookings: IBooking[];
  };
}

interface BookingResponse {
  success: boolean;
  data: {
    booking: IBooking;
  };
}

export const bookingsApi = {
  getAll: async (): Promise<IBooking[]> => {
    const response = await api.get<BookingsResponse>("/bookings");
    return response.data.data.bookings;
  },

  getById: async (id: string): Promise<IBooking> => {
    const response = await api.get<BookingResponse>(`/bookings/${id}`);
    return response.data.data.booking;
  },

  create: async (data: CreateBookingRequest): Promise<IBooking> => {
    const response = await api.post<BookingResponse>("/bookings", data);
    return response.data.data.booking;
  },

  update: async (id: string, data: UpdateBookingRequest): Promise<IBooking> => {
    const response = await api.put<BookingResponse>(`/bookings/${id}`, data);
    return response.data.data.booking;
  },

  updateStatus: async (id: string, status: UpdateStatusRequest["status"]): Promise<IBooking> => {
    const response = await api.patch<BookingResponse>(`/bookings/${id}`, { status });
    return response.data.data.booking;
  },
};
