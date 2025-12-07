import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
const getAllUsers = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role FROM users`);
  return result;
};

const updateUser = async (payload: any, id: string) => {
  const { name, email, password, phone, role } = payload;
  if (password?.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  let hashedPass;
  if (password) {
    hashedPass = await bcrypt.hash(password, 10);
  }
  const result = await pool.query(
    `UPDATE users SET 
      name  = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      password = COALESCE($4, password),
      role = COALESCE($5, role)
       WHERE id = $6
    RETURNING  * `,
    [name, email.toLowerCase(), phone, hashedPass, role, id]
  );
  return result;
};

const deleteUser = async (id: string) => {
  const activeBooking = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
    [id]
  );

  if (activeBooking.rows.length > 0) {
    throw new Error("User has active booking.");
  }
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const userServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};
