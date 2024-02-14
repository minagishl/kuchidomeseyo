import type { NextRequest } from 'next/server';
import prisma from '@/app/client';
import { Post } from '@prisma/client';

export const runtime = 'edge';

// Return error
export async function GET() {
  return new Response(`This endpoint only accepts POST requests.`, { status: 405 });
}

export async function POST(request: NextRequest) {
  if (!request.body) {
    return new Response(`Request body is required.`, { status: 400 });
  }

  const { title, deleteAfterDisplay } = (await request.json()) as {
    title: string;
    deleteAfterDisplay: boolean;
  };

  if (title === undefined || deleteAfterDisplay === undefined) {
    return new Response(`Request body is not formatted correctly.`, { status: 400 });
  } else if (title.length > 30) {
    return new Response(`Title is too long.`, { status: 400 });
  } else if (title.length === 0) {
    return new Response(`Title is required.`, { status: 400 });
  }

  const id = generateRandomId();
  const ipAddress = getClientIpAddress(request);
  const createdAt = new Date();
  const updatedAt = createdAt;

  try {
    const post = await prisma.post.create({
      data: {
        id,
        title,
        hideTitle: false,
        deleteAfterDisplay,
        ipAddress,
        createdAt,
        updatedAt,
        isDisplayed: false,
      } as Post,
    });

    return new Response(JSON.stringify({ id, title, deleteAfterDisplay, createdAt, updatedAt }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(`Failed to create a post.`, { status: 500 });
  }
}

function generateRandomId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}

function getClientIpAddress(request: NextRequest) {
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for') ||
    request.ip;
  return ip;
}
