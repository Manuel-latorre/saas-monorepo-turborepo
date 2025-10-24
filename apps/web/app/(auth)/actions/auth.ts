"use server";

import { BACKEND_URL } from "@/lib/constants";
import { redirect } from "next/navigation";
import { FormState } from "../types/types";
import { LoginFormSchema, SignupFormSchema } from "../types/schemas/auth";
import { createSession } from "./session";

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const valiationFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!valiationFields.success) {
    const fieldErrors = valiationFields.error.flatten().fieldErrors;
    return {
      error: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password,
      },
      message: "Validation failed",
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(valiationFields.data),
  });

  console.log("RESPOMSE---->>", response);

  if (response.ok) {
    redirect("/login");
  } else
    return {
      message:
        response.status === 409
          ? "The user is already registered!"
          : response.statusText,
    };
}

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      error: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password,
      },
      message: "Validation failed",
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedFields.data),
  });

  if (response.ok) {
    const result = await response.json();

    await createSession({
      user: {
        id: result.id,
        name: result.name,
      },
      accessToken:result.accessToken,
      refreshToken: result.refreshToken
    });

    console.log({ result });
    redirect("/dashboard");

  } else {
    return {
      message:
        response.status === 401 ? "Invalidad Credentials" : response.statusText,
    };
  }
}
