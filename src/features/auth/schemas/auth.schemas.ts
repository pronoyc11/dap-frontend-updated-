import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").max(128, "Password is too long"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(150, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must not exceed 128 characters"),
  role: z.enum(["CANDIDATE", "RECRUITER"]),
});

export const verifyEmailSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  otp: z.string().trim().regex(/^\d{6}$/, "Enter the six-digit verification code"),
});
