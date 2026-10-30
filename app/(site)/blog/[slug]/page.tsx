import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublishedPost } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const post = await getPublishedPost(params.slug);
  if (!post) return {};
  return {
    title: post.seo_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPublishedPost(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/blog" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>
      {post.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image} alt={post.title} className="mb-8 aspect-[16/8] w-full rounded-xl object-cover" />
      )}
      <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        {post.author_name && <span>By {post.author_name}</span>}
        {post.author_name && <span>·</span>}
        <time>{new Date(post.created_at).toLocaleDateString()}</time>
      </div>
      {post.excerpt && <p className="mt-6 text-lg text-muted-foreground">{post.excerpt}</p>}
      <div className="prose-content mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
