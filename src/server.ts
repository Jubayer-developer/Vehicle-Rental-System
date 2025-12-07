import express from "express";
const app = express();
const port = config.port;

import config from "./config";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";
import { userRoutes } from "./modules/users/users.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/vehicles", vehicleRoutes);

app.use("/api/v1/bookings", bookingRoutes);

initDB();

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
