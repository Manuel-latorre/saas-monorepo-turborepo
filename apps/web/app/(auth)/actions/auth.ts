"use server";

import { BACKEND_URL } from "@/lib/constants";
import { redirect } from "next/navigation";
import { FormState } from "../types/types";
import { LoginFormSchema, SignupFormSchema } from "../types/schemas/auth";
import { createSession, getSession, updateTokens } from "./session";
import { FetchOptions } from "../types/auth";

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


export async function refreshToken (oldRefreshToken:string) {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      body: JSON.stringify({
        refresh: oldRefreshToken
      })
    })

    if(!response.ok)  {
      throw new Error("Failed to refresh token");
    }


    const {accessToken, refreshToken} = await response.json();

    const updateRes = await fetch("http://localhost:3000/api/auth/update", {
      method: "POST",
      body:JSON.stringify({
        accessToken, 
        refreshToken
      })
    });

    if(!updateRes.ok) throw new Error("Failed to update the tokens");

    return accessToken;

  } catch (error) {
    console.error("Refresh token failed: ", error);
    return null;
    
  }
}


export async function authFetch (url:string | URL, options:FetchOptions = {}){

  const session = await getSession();

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`
  }

  let response = await fetch(url, options);


  if(response.status === 401){
    if(!session?.refreshToken) throw new Error("refresh token not found!");


    const newAccessToken = await refreshToken(session.refreshToken);

    if(newAccessToken){
      options.headers.Authorization = `Bearer ${newAccessToken}`;

      response = await fetch(url, options);
    }
  }

  return response;
}