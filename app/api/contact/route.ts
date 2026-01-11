import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  // এখানে email sending logic যোগ করা যাবে (SMTP / nodemailer)
  console.log("New Contact Message:", { name, email, message });

  return NextResponse.json({ message: "Message sent successfully!" });
}
