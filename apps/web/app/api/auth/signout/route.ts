import { deleteSession } from "@/app/(auth)/actions/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    await deleteSession();

    return NextResponse.redirect(new URL("/login", req.nextUrl));
}