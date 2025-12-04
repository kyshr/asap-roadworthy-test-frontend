"use client";

import { useEffect, useState } from "react";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { IBooking } from "@/types";
import { bookingsApi } from "@/lib/api/bookings";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingsApi.getAll();
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchBookings}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BookingsTable bookings={bookings} onRefresh={fetchBookings} />
    </div>
  );
}
