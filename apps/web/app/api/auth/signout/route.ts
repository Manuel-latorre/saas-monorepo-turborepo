import { authFetch } from "@/app/(auth)/actions/auth";
import { deleteSession } from "@/app/(auth)/actions/session";
import { BACKEND_URL } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = await authFetch(`${BACKEND_URL}/auth/signout`, {
    method: "POST",
  });

  if (response.ok) {
    await deleteSession();
  }

  return NextResponse.redirect(new URL("/login", req.nextUrl));
}
