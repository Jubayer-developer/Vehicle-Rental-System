import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getBookings(req.user);

    res.status(200).json({
      success: true,
      message:
        req.user?.role === "customer"
          ? "Your bookings retrived successfully"
          : "Bookings retrived successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const id = req.params.bookingId;
  try {
    const result = await bookingServices.updateBooking(id as string, req.user);

    res.status(200).json({
      success: true,
      message:
        req.user?.role === "customer"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      err: err,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking,
};
