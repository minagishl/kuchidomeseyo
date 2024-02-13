import { LRUCache } from 'lru-cache';
import prisma from '@/app/client';
import { Post } from '@prisma/client';

const cache = new LRUCache({
  max: 500, // The maximum size of the cache
  ttl: 1000 * 60 * 60 * 24 * 7, // how long to live in ms
});

export default async function getCache(id: string) {
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

  return [data, isInvisible];
}
