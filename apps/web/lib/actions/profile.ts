"use server";

import { getSession } from "@/app/(auth)/actions/session";
import { BACKEND_URL } from "../constants";

export async function getProfile() {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/auth/protected`, {
    headers: {
      authorization: `Bearer ${session?.accessToken}`,
    },
  });

  const result = await response.json();

  return result;
};
