import { PageEditor } from '../page-editor';

export default function EditPagePage({ params }: { params: { id: string } }) {
  return <PageEditor pageId={params.id} />;
}
