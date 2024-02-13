import { ImageResponse } from 'next/og';
import { Post } from '@prisma/client';
import { notFound } from 'next/navigation';
import getCache from './getCache';
import ImageBody from './imageBody';

export const runtime = 'edge';

export default async function Image({ params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (typeof id !== 'string') {
      return notFound();
    }

    const [data] = (await getCache(id)) as [Post];

    const fontData = await fetch(new URL('./assets/NotoSerifJP-Bold.otf', import.meta.url)).then((res) =>
      res.arrayBuffer()
    );

    return new ImageResponse(<ImageBody hideTitle={data.hideTitle} title={data.title} />, {
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
    });
  } catch (e: any) {
    console.error(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
