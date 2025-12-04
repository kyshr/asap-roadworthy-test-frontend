"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IBooking } from "@/types";
import { BookingFormModal } from "./BookingFormModal";
import { Plus, MoreVertical, Pencil, X } from "lucide-react";
import { bookingsApi } from "@/lib/api/bookings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BookingsTableProps {
  bookings: IBooking[];
  onRefresh: () => void;
}

export function BookingsTable({ bookings, onRefresh }: BookingsTableProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<IBooking | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingBooking(bookingId);
    try {
      await bookingsApi.update(bookingId, { status: "cancelled" });
      onRefresh();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    } finally {
      setCancellingBooking(null);
    }
  };

  const handleEdit = (booking: IBooking) => {
    setEditingBooking(booking);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">Manage and track your bookings</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Booking
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking Number</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No bookings found. Create your first booking to get started.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id || booking.bookingNumber}>
                  <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                  <TableCell>{booking.serviceType}</TableCell>

                  <TableCell className="max-w-[200px] truncate">{booking.description || "N/A"}</TableCell>
                  <TableCell>{formatDate(booking.scheduledDate)}</TableCell>
                  <TableCell>{booking.location || "N/A"}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>{formatDate(booking.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={cancellingBooking === booking.id}>
                          <MoreVertical className="h-4 w-4 rotate-90" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleEdit(booking)}
                          disabled={booking.status === "cancelled" || booking.status === "completed"}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCancelBooking(booking.id || "")}
                          disabled={booking.status === "cancelled" || cancellingBooking === booking.id}
                          className="text-destructive focus:text-destructive">
                          <X className="mr-2 h-4 w-4" />
                          {cancellingBooking === booking.id ? "Cancelling..." : "Cancel Booking"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BookingFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        booking={null}
        onSuccess={onRefresh}
      />

      <BookingFormModal
        open={!!editingBooking}
        onOpenChange={(open) => !open && setEditingBooking(null)}
        booking={editingBooking}
        onSuccess={onRefresh}
      />
    </>
  );
}
