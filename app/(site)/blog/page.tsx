import Link from 'next/link';
import { getPublishedPosts } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted-foreground">News, updates, and stories.</p>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/40 hover:shadow-lg"
          >
            {post.cover_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover_image} alt={post.title} className="h-48 w-full object-cover transition group-hover:scale-[1.02]" />
            )}
            <div className="flex flex-1 flex-col p-5">
              <h2 className="text-lg font-semibold text-card-foreground group-hover:text-primary">{post.title}</h2>
              {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>}
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                {post.author_name && <span>By {post.author_name}</span>}
                <span>·</span>
                <time>{new Date(post.created_at).toLocaleDateString()}</time>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && <p className="mt-10 text-muted-foreground">No posts yet. Check back soon.</p>}
    </div>
  );
}
