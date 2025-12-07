import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.connection_str,
});

const initDB = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users(
           id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone VARCHAR(30) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'customer')) DEFAULT 'customer'
        )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS vehicles(
             id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(150) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
  registration_number VARCHAR(100) UNIQUE NOT NULL,
  daily_rent_price INT CHECK (daily_rent_price > 0),
  availability_status VARCHAR(20)  DEFAULT 'available'
            )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS bookings(
                 id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price INT CHECK (total_price > 0),
  status VARCHAR(20) CHECK (status IN ('active','cancelled','returned')) DEFAULT 'active'
                )`);
};

export default initDB;
