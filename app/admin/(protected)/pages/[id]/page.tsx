import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { PageEditor } from '../page-editor';

export default function EditPagePage({ params }: { params: { id: string } }) {
  if (!params.id || params.id === 'undefined' || params.id === 'null') {
    redirect('/admin/pages');
  }
  return (
    <Suspense fallback={null}>
      <PageEditor pageId={params.id} />
    </Suspense>
  );
}
