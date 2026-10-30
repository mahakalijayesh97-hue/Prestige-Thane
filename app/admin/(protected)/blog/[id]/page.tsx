import { PostEditor } from '../post-editor';
export default function EditPostPage({ params }: { params: { id: string } }) {
  return <PostEditor postId={params.id} />;
}
