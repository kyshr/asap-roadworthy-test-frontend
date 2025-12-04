export interface IUser {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface IBooking {
  id?: string;
  customer: string;
  bookingNumber: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  serviceType: string;
  description?: string;
  scheduledDate?: Date;
  location?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
