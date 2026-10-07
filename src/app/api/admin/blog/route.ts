import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const { data: posts, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, posts });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, title_bn, slug, summary, content, cover_image, category, tags = [], is_published = true, read_time = '4 min read', author = 'Bechakena+ Editorial Team', seo_title, seo_description } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        title,
        title_bn,
        slug: cleanSlug,
        summary,
        content,
        cover_image,
        category,
        tags,
        is_published: Boolean(is_published),
        read_time,
        author,
        seo_title: seo_title || title,
        seo_description: seo_description || summary,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, post });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create blog post';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
