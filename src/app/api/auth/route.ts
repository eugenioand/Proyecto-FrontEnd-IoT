import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (email === "test@example.com" && password === "password") {
    const token = "fake-jwt-token"; // Aquí iría el token real generado con JWT
        return NextResponse.json({ token });
    } else {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
}