"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IBooking } from "@/types";

interface BookingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: IBooking | null;
  onSuccess: () => void;
}

const statusOptions: IBooking["status"][] = ["pending", "confirmed", "in-progress", "completed", "cancelled"];

export function BookingFormModal({ open, onOpenChange, booking, onSuccess }: BookingFormModalProps) {
  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    scheduledDate: "",
    location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        serviceType: booking.serviceType || "",
        description: booking.description || "",
        scheduledDate: booking.scheduledDate ? new Date(booking.scheduledDate).toISOString().slice(0, 16) : "",
        location: booking.location || "",
      });
    } else {
      setFormData({
        serviceType: "",
        description: "",
        scheduledDate: "",
        location: "",
      });
    }
    setErrors({});
  }, [booking, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.serviceType.trim()) {
      newErrors.serviceType = "Service type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { bookingsApi } = await import("@/lib/api/bookings");
      const submitData = {
        serviceType: formData.serviceType.trim(),
        description: formData.description.trim() || undefined,
        scheduledDate: formData.scheduledDate || undefined,
        location: formData.location.trim() || undefined,
      };

      if (booking) {
        if (!booking.id) {
          throw new Error("Booking ID is required for update");
        }
        await bookingsApi.update(booking.id, submitData);
      } else {
        await bookingsApi.create(submitData);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      const response = error.response?.data;

      if (response?.errors) {
        const apiErrors = response.errors;
        Object.keys(apiErrors).forEach((key) => {
          setErrors((prev) => ({ ...prev, [key]: apiErrors[key] }));
        });
      }

      const message =
        response?.message || response?.error || `Failed to ${booking ? "update" : "create"} booking. Please try again.`;
      setErrors((prev) => ({ ...prev, submit: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{booking ? "Update Booking" : "Create Booking"}</DialogTitle>
          <DialogDescription>
            {booking ? "Update the booking details below." : "Fill in the details to create a new booking."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">
                Service Type <span className="text-destructive">*</span>
              </Label>
              <Input
                id="serviceType"
                placeholder="e.g., Roadworthy Inspection"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className={errors.serviceType ? "border-destructive" : ""}
              />
              {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Enter booking description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., 123 Main St, City"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (booking ? "Updating..." : "Creating...") : booking ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
