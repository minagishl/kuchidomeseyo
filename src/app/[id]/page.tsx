'use strict';

import { LRUCache } from 'lru-cache';
import prisma from '@/app/client';
import { Post } from '@prisma/client';
import Script from 'next/script';
import { notFound } from 'next/navigation';

const cache = new LRUCache({
  max: 500, // The maximum size of the cache
  ttl: 1000 * 60 * 60 * 24 * 7, // how long to live in ms
});

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id;
  let data = cache.get(id) as Post | null;

  if (!data) {
    data = await prisma.post.findUnique({
      where: { id: String(id) },
    });

    if (data === null) return notFound();

    cache.set(id, data ?? '');
  }

  // For settings to be deleted after opening
  if (data?.deleteAfterDisplay && data?.isDisplayed === false) {
    data.isDisplayed = true;
    if (!cache.delete(id)) console.error('Failed to delete cache');

    await prisma.post.update({
      where: { id: String(id) },
      data: { isDisplayed: true },
    });

    cache.set(id, data);
  } else if (data?.isDisplayed) {
    return null;
  }

  return {
    title: data?.title ?? '？？？',
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  let data = cache.get(id) as Post | null;

  if (!data) {
    data = await prisma.post.findUnique({
      where: { id: String(id) },
    });

    if (data === null) return notFound();

    cache.set(id, data ?? '');
  }

  // For settings to be deleted after opening
  if (data?.deleteAfterDisplay && data?.isDisplayed === false) {
    data.isDisplayed = true;
    if (!cache.delete(id)) console.error('Failed to delete cache');

    await prisma.post.update({
      where: { id: String(id) },
      data: { isDisplayed: true },
    });

    cache.set(id, data);
  } else if (data?.isDisplayed) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <h1 className="text-center font-serif text-4xl font-bold">{data?.title ?? '？？？'}</h1>
      <p className="pt-9 text-center font-serif text-sm font-semibold leading-7">
        {data?.deleteAfterDisplay
          ? '※このメッセージは5秒後に自動的に消滅します。'
          : '※このメッセージは5秒後に自動的に消滅しないので、'}
        <br />
        {data?.deleteAfterDisplay ? '' : '各自が責任を持って削除すること'}
      </p>
      {data?.deleteAfterDisplay && (
        <Script id="reload">
          {`
            setTimeout(() => {
              window.location.href = '/';
            }, 5000);
          `}
        </Script>
      )}
    </main>
  );
}
