import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bechakena.plus';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/adminproduct/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
