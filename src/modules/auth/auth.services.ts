import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const registerUser = async (payload: Route<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO  users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role`,
    [name, email.toLowerCase(), hashedPass, phone, role]
  );

  return result;
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT *  FROM  users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length == 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = await jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwt_secret,
    {
      expiresIn: "4d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

export const authServices = {
  registerUser,
  loginUser,
};
