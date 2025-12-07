import { pool } from "../../config/db";

const createBooking = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicle = await pool.query(`SELECT * FROM  vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  if (vehicle.rowCount === 0) {
    throw new Error("Vechile not found");
  }

  if (vehicle.rows[0].availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  const dateDifference = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(dateDifference / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    throw new Error("End date must be  after start date");
  }

  const price = days * vehicle.rows[0].daily_rent_price;

  const result = await pool.query(
    ` INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date,total_price) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, price]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  const resultData = result.rows[0];

  return {
    ...resultData,
    vehicle: {
      vehicle_name: vehicle.rows[0].vehicle_name,
      daily_rent_price: vehicle.rows[0].daily_rent_price,
    },
  };
};

const getBookings = async (user: any) => {
  let result;
  if (user.role === "admin") {
    result = await pool.query(`SELECT *  FROM bookings`);
  } else {
    result = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [
      user.id,
    ]);
  }

  const bookings = result.rows;
  const finalData = [];

  const currentDate = new Date();

  for (let b of bookings) {
    const endDate = new Date(b.rent_end_date);
    if (b.status === "active") {
      if (endDate < currentDate) {
        await pool.query(
          "UPDATE bookings SET status = 'returned' WHERE id = $1",
          [b.id]
        );

        await pool.query(
          "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
          [b.vehicle_id]
        );

        b.status = "returned";
      }
    }

    const vehicleRes = await pool.query(
      `SELECT vehicle_name, registration_number, type, daily_rent_price
       FROM vehicles WHERE id=$1`,
      [b.vehicle_id]
    );

    const vehicle = vehicleRes.rows[0];

    let customer = null;

    if (user.role === "admin") {
      const customerRes = await pool.query(
        `SELECT name, email FROM users WHERE id=$1`,
        [b.customer_id]
      );

      customer = customerRes.rows[0];
    }

    if (user.role === "admin") {
      finalData.push({
        ...b,
        customer,
        vehicle: {
          vehicle_name: vehicle.vehicle_name,
          registration_number: vehicle.registration_number,
        },
      });
    } else {
      finalData.push({
        id: b.id,
        vehicle_id: b.vehicle_id,
        rent_start_date: b.rent_start_date,
        rent_end_date: b.rent_end_date,
        total_price: b.total_price,
        status: b.status,
        vehicle: {
          vehicle_name: vehicle.vehicle_name,
          registration_number: vehicle.registration_number,
          type: vehicle.type,
        },
      });
    }
  }

  return finalData;
};

const updateBooking = async (id: string, user: any) => {
  const booking = await pool.query(`SELECT * FROM  bookings WHERE id=$1`, [id]);
  if (booking.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const bookingData = booking.rows[0];

  if (user.role === "customer") {
    const currentDate = new Date();
    const startDate = new Date(bookingData.rent_start_date);

    if (currentDate >= startDate) {
      throw new Error("You  can't  cancel after booking start date");
    }

    const updatedBooking = await pool.query(
      `UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`,
      [id]
    );
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [bookingData.vehicle_id]
    );

    const updateBookingResult = updatedBooking.rows[0];

    return updateBookingResult;
  }

  if (user.role === "admin") {
    const updatedBooking = await pool.query(
      `UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`,
      [id]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [bookingData.vehicle_id]
    );

    const updatedBookingResults = updatedBooking.rows[0];
    const vehicle = await pool.query(
      `SELECT availability_status FROM  vehicles WHERE id=$1`,
      [updatedBookingResults.vehicle_id]
    );
    const vehicleData = vehicle.rows[0];
    return {
      ...updatedBookingResults,
      vehicle: {
        availability_status: vehicleData.availability_status,
      },
    };
  }
};

export const bookingServices = {
  createBooking,
  getBookings,
  updateBooking,
};
