'use strict';

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';
import prisma from '@/app/client';
import { Post } from '@prisma/client';

const cache = new LRUCache({
  max: 500, // The maximum size of the cache
  ttl: 1000 * 60 * 60 * 24 * 7, // how long to live in ms
});

export const runtime = 'edge';

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get('id');

    if (!id) {
      return new Response(`Id is not specified correctly.`, {
        status: 400,
      });
    }

    let data = cache.get(id) as Post | null;
    let isInvisible: boolean = false;

    if (!data) {
      data = await prisma.post.findUnique({
        where: { id },
      });

      cache.set(id, data ?? '');
    }

    if (data?.isDisplayed) {
      isInvisible = true; // Flag for confirmation
    }

    const fontData = await fetch(new URL('./assets/NotoSerifJP-Bold.otf', import.meta.url)).then((res) =>
      res.arrayBuffer()
    );

    return new ImageResponse(
      (
        <main
          style={{
            display: 'flex',
            minHeight: '100%',
            minWidth: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem',
            backgroundColor: 'white',
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 700,
              lineHeight: '2.5rem',
              fontFamily: 'NotoSerifJP, sans-serif',
              textAlign: 'center',
            }}
          >
            {data?.hideTitle ? '？？？' : data?.title ?? '？？？'}
          </h1>
        </main>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'NotoSerifJP',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );
  } catch (e: any) {
    console.error(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
