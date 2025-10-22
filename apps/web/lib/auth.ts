"use server";

import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { FormState, SignupFormSchema } from "./types";

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
    method:"POST",
    headers: {
        "Content-Type": "application/json",
    },
    body:JSON.stringify(valiationFields.data)
  })

  console.log("RESPOMSE---->>", response);


  if(response.ok){
      
      redirect("/login")
    }

  else return {
    message: response.status === 409 ? "The user is already registered!" :  response.statusText
  }
}
