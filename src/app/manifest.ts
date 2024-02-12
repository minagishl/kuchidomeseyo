import { MetadataRoute } from 'next';
import { title, description } from '@/constant';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: title,
    short_name: title,
    description: description,
    start_url: '/',
    orientation: 'portrait',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
  };
}
