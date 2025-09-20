// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { executeQuery } from "@/lib/db"; // keep if you actually use it

type LoginBody = {
  email?: unknown;
  password?: unknown;
  userType?: unknown; // optional - narrow later
};

type UserRow = {
  id: number;
  email: string;
  name?: string | null;
  password?: string | null;
  [k: string]: unknown;
};

type ApiResponse<T = unknown> = { success: boolean; message?: string } & T;

export async function POST(req: NextRequest) {
  try {
    // parse and type-narrow the body safely
    const body = (await req.json()) as LoginBody | unknown;

    if (typeof body !== "object" || body === null) {
      const res: ApiResponse = { success: false, message: "Invalid request body" };
      return NextResponse.json(res, { status: 400 });
    }

    const email =
      typeof (body as { email?: unknown }).email === "string"
        ? ((body as { email: string }).email.trim().toLowerCase())
        : "";
    const password =
      typeof (body as { password?: unknown }).password === "string"
        ? (body as { password: string }).password
        : "";
    const userType =
      typeof (body as { userType?: unknown }).userType === "string"
        ? (body as { userType: string }).userType
        : "user";

    if (!email || !password) {
      const res: ApiResponse = { success: false, message: "Email and password are required" };
      return NextResponse.json(res, { status: 400 });
    }

    // Example DB lookup - adapt SQL/table to your schema
    // Use parameterized queries in your executeQuery implementation to avoid SQL injection
    const table = userType === "admin" ? "admins" : "users";
    const sql = `SELECT * FROM ${table} WHERE email = ? LIMIT 1`;
    const values = [email];

    // executeQuery should return an array of rows
    const rows = (await executeQuery(sql, values)) as UserRow[] | null;

    if (!rows || rows.length === 0) {
      const res: ApiResponse = { success: false, message: "Invalid credentials" };
      return NextResponse.json(res, { status: 401 });
    }

    const user = rows[0];

    // TODO: replace this with proper hashed-password verification
    // Example (pseudo):
    // const passwordMatches = await verifyPassword(password, user.password)
    // For now, assume plaintext (not recommended)
    const stored = typeof user.password === "string" ? user.password : "";
    const passwordMatches = stored !== "" && password === stored;

    if (!passwordMatches) {
      const res: ApiResponse = { success: false, message: "Invalid credentials" };
      return NextResponse.json(res, { status: 401 });
    }

    // Create a token / session (example)
    // Replace with real JWT creation or session logic
    const token = "fake-jwt-token-for-demo"; // TODO: replace

    // Set cookie (if you want to set it server side)
    try {
      const cookieStore = cookies();
      cookieStore.set({
        name: "session",
        value: token,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        // secure: process.env.NODE_ENV === 'production' // enable in prod
      });
    } catch (err) {
      // cookies() may not be available in all contexts; ignore if not set
      // Do not let cookie failures break the login
    }

    // Remove password before returning
    const { password: _pw, ...safeUser } = user;

    const resBody: ApiResponse<{ user: Record<string, unknown>; token: string }> = {
      success: true,
      message: "Login successful",
      user: safeUser,
      token,
    };

    return NextResponse.json(resBody);
  } catch (err: unknown) {
    // Narrow error message safely
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Login route error:", err);
    const res: ApiResponse = { success: false, message: `Server error: ${message}` };
    return NextResponse.json(res, { status: 500 });
  }
}
