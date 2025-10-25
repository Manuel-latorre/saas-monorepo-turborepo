"use server";

import { getSession } from "@/app/(auth)/actions/session";
import { BACKEND_URL } from "../constants";
import { authFetch } from "@/app/(auth)/actions/auth";

export async function getProfile() {
  /* const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/auth/protected`, {
    headers: {
      authorization: `Bearer ${session?.accessToken}`,
    },
  }); */

  const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  const result = await response.json();

  return result;
};
