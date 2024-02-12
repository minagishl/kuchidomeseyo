import Script from 'next/script';
import { title } from '@/constant';
import { getHostedUrl } from '@/utils/urlHelper';

export default function JsonLD() {
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: title,
      url: getHostedUrl(),
    },
  ];

  return (
    // eslint-disable-next-line @next/next/inline-script-id
    <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }} />
  );
}
