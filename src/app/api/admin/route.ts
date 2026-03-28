import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Admin email - only this user can access admin features
const ADMIN_EMAIL = "leveranciervanoptimisme@gmail.com";

async function isAdmin() {
  const session = await auth();
  return session?.user?.email === ADMIN_EMAIL;
}

// GET: list all users with their audit count and credits
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      credits: true,
      createdAt: true,
      _count: { select: { audits: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

// POST: update credits for a user
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
  }

  const body = await request.json();
  const { userId, credits } = body;

  if (!userId || credits === undefined) {
    return NextResponse.json(
      { error: "userId en credits zijn verplicht." },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { credits: parseInt(credits) },
    select: { id: true, email: true, credits: true },
  });

  return NextResponse.json({ user });
}
