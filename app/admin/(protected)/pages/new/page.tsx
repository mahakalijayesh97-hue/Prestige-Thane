import { Suspense } from 'react';
import { PageEditor } from '../page-editor';

export default function NewPagePage() {
  return (
    <Suspense fallback={null}>
      <PageEditor />
    </Suspense>
  );
}
