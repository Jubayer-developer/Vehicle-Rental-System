import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./bookings.controllers";

const router = Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);

router.get("/", auth("admin", "customer"), bookingControllers.getBookings);

router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingControllers.updateBooking
);

export const bookingRoutes = router;
