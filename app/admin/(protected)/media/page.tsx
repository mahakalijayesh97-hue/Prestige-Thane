'use client';

import { useEffect, useState, useRef } from 'react';
import { logActivity } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Copy,
  Trash2,
  Upload,
  Check,
  Search,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  X,
  FileImage,
  Pencil,
  RefreshCw,
} from 'lucide-react';

interface Media {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number | null;
  created_at: string;
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(url: string, name?: string): string {
  const target = name || url;
  const match = target.match(/\.([a-zA-Z0-9]+)($|\?)/);
  return match ? match[1].toUpperCase() : 'IMG';
}

let cachedMediaList: Media[] | null = null;

export default function AdminMediaPage() {
  const [rows, setRows] = useState<Media[]>(() => cachedMediaList || []);
  const [loading, setLoading] = useState(() => !cachedMediaList);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'upload' | 'url'>('upload');

  // URL Import state
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [addingUrl, setAddingUrl] = useState(false);

  // Drag and Drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox Preview Modal
  const [previewMedia, setPreviewMedia] = useState<Media | null>(null);

  // Edit / Update Media state
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editReplacementFile, setEditReplacementFile] = useState<File | null>(null);
  const [editReplacementPreview, setEditReplacementPreview] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');
  const [editTab, setEditTab] = useState<'upload' | 'url'>('upload');
  const editFileInputRef = useRef<HTMLInputElement>(null);

  function openEditModal(m: Media) {
    setEditingMedia(m);
    setEditName(m.name);
    setEditUrl(m.url);
    setEditReplacementFile(null);
    setEditReplacementPreview(null);
    setEditError('');
    setEditTab('upload');
  }

  function handleReplacementFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setEditError('Only image files (PNG, JPG, WebP, SVG, GIF) are allowed.');
      return;
    }
    setEditError('');
    setEditReplacementFile(file);
    const objectUrl = URL.createObjectURL(file);
    setEditReplacementPreview(objectUrl);
  }

  async function handleUpdateMedia(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMedia) return;

    setSavingEdit(true);
    setEditError('');

    try {
      let finalUrl = editUrl.trim() || editingMedia.url;
      let finalSize = editingMedia.size;

      // If a replacement file was chosen, upload it first
      if (editReplacementFile) {
        const formData = new FormData();
        formData.append('file', editReplacementFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData.error || 'Failed to upload replacement image');
        }
        finalUrl = uploadData.url;
        finalSize = editReplacementFile.size;
      }

      const res = await fetch(`/api/media/${editingMedia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingMedia.id,
          name: editName.trim() || editingMedia.name,
          url: finalUrl,
          size: finalSize,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to update media item');
      }

      const updated = await res.json();
      await logActivity('update', 'media', editName.trim() || editingMedia.name, editingMedia.id);

      setRows((prev) =>
        prev.map((item) => (item.id === editingMedia.id ? { ...item, ...updated.item } : item))
      );

      if (previewMedia?.id === editingMedia.id) {
        setPreviewMedia((prev) => (prev ? { ...prev, ...updated.item } : null));
      }

      setEditingMedia(null);
      setEditReplacementFile(null);
      setEditReplacementPreview(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating media';
      setEditError(msg);
    } finally {
      setSavingEdit(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function load() {
    if (!cachedMediaList) setLoading(true);
    try {
      const res = await fetch('/api/media', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const items = data.items || [];
        cachedMediaList = items;
        setRows(items);
      }
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  }

  // Handle direct file upload (from device)
  async function handleFilesUpload(files: FileList | File[]) {
    if (!files || files.length === 0) return;

    setUploadError('');
    setUploading(true);

    let successCount = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          setUploadError(`"${file.name}" is not an image file.`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          await logActivity('create', 'media', file.name, data.url);
          successCount++;
        } else {
          const errData = await res.json();
          setUploadError(errData.error || `Failed to upload ${file.name}`);
        }
      }

      if (successCount > 0) {
        await load();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  // Handle external URL import
  async function addUrl() {
    if (!urlInput.trim()) return;
    setAddingUrl(true);
    setUploadError('');

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          name: nameInput.trim() || undefined,
          type: 'image',
        }),
      });

      if (res.ok) {
        await logActivity('create', 'media', nameInput || urlInput);
        setUrlInput('');
        setNameInput('');
        await load();
      } else {
        const data = await res.json();
        setUploadError(data.error || 'Failed to save image URL');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding URL';
      setUploadError(msg);
    } finally {
      setAddingUrl(false);
    }
  }

  // Handle Media deletion
  async function remove(id: string, n: string) {
    if (!confirm(`Are you sure you want to remove "${n}"?`)) return;

    try {
      const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await logActivity('delete', 'media', n, id);
        setRows((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert('Failed to delete media item.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  }

  function copyUrl(u: string) {
    navigator.clipboard.writeText(u);
    setCopied(u);
    setTimeout(() => setCopied(null), 1800);
  }

  const filtered = rows.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl space-y-6">
      <AdminHeader
        title="Media Library"
        description="Upload images directly from your device or import external URLs to reuse across pages, banners, blogs, and footer."
        backHref="/admin"
      />

      {/* Main Upload Card */}
      <Card className="p-5 shadow-sm border-border">
        {/* Tab switch: Upload from device vs Import URL */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                tab === 'upload'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Upload className="h-3.5 w-3.5" /> Upload from Device
            </button>
            <button
              type="button"
              onClick={() => setTab('url')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                tab === 'url'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" /> Import from URL
            </button>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Max file size: 5MB • PNG, JPG, WebP, SVG, GIF
          </span>
        </div>

        {tab === 'upload' ? (
          /* Direct Drag-and-Drop / File Picker Zone */
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFilesUpload(e.target.files)}
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              multiple
              className="hidden"
              id="media-file-upload-input"
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) {
                  handleFilesUpload(e.dataTransfer.files);
                }
              }}
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-primary bg-primary/10 scale-[0.99]'
                  : 'border-border/80 bg-muted/20 hover:border-primary/60 hover:bg-muted/40'
              }`}
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary mb-3">
                {uploading ? (
                  <Loader2 className="h-7 w-7 animate-spin" />
                ) : (
                  <Upload className="h-7 w-7" />
                )}
              </div>
              <p className="text-sm font-semibold text-foreground">
                {uploading
                  ? 'Uploading images to server...'
                  : 'Click to browse files or drag & drop images here'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You can select multiple files at once. PNG, JPG, WebP, SVG or GIF.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                className="mt-4 pointer-events-none gap-1.5 text-xs"
              >
                <FileImage className="h-3.5 w-3.5" /> Browse from Computer
              </Button>
            </div>
          </div>
        ) : (
          /* External URL Input Form */
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="media_name" className="text-xs font-semibold">
                  Name (optional)
                </Label>
                <Input
                  id="media_name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Master Bedroom View"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="media_url" className="text-xs font-semibold">
                  Image URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="media_url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/... or https://..."
                  className="h-9 font-mono text-xs"
                />
              </div>
            </div>
            <Button
              onClick={addUrl}
              disabled={addingUrl || !urlInput.trim()}
              className="gap-2 text-xs"
            >
              {addingUrl ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LinkIcon className="h-3.5 w-3.5" />
              )}
              {addingUrl ? 'Saving...' : 'Add Image URL to Library'}
            </Button>
          </div>
        )}

        {uploadError && (
          <p className="mt-3 text-xs text-destructive font-medium bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">
            {uploadError}
          </p>
        )}
      </Card>

      {/* Gallery Header & Search Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary" /> Stored Media
          </h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {rows.length} {rows.length === 1 ? 'image' : 'images'}
          </span>
        </div>

        {rows.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images by name..."
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>
        )}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground mt-2">Loading media library...</p>
        </div>
      ) : rows.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground mb-3">
            <ImageIcon className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No media uploaded yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Drag & drop images above or click Browse to upload your project images, banners, and logos.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 gap-1.5 text-xs"
          >
            <Upload className="h-3.5 w-3.5" /> Upload your first image
          </Button>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-xs text-muted-foreground">
          No media matching &quot;{search}&quot;.
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((m) => {
            const ext = getFileExtension(m.url, m.name);
            const sizeStr = formatBytes(m.size);

            return (
              <Card
                key={m.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border-border bg-card transition hover:border-primary/50 hover:shadow-md"
              >
                {/* Image Thumbnail with Overlay */}
                <div
                  onClick={() => setPreviewMedia(m)}
                  className="relative aspect-video w-full cursor-pointer overflow-hidden bg-muted/40"
                  title="Click to view full image"
                >
                  {/* Checkerboard pattern for transparent graphics */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]" />

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.url}
                    alt={m.name}
                    className="h-full w-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="10" y="50" fill="%23999">Broken Image</text></svg>';
                    }}
                  />

                  {/* Badges on top */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                      {ext}
                    </span>
                    {sizeStr && (
                      <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white/90 backdrop-blur-xs">
                        {sizeStr}
                      </span>
                    )}
                  </div>

                  {/* View Full Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-900 shadow">
                      <Maximize2 className="h-3 w-3" /> View
                    </span>
                  </div>
                </div>

                {/* Info & Action Buttons */}
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <p
                      className="truncate text-xs font-semibold text-foreground"
                      title={m.name}
                    >
                      {m.name}
                    </p>
                    <p
                      className="truncate text-[10px] font-mono text-muted-foreground mt-0.5 select-all"
                      title={m.url}
                    >
                      {m.url}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-border/60">
                    <Button
                      variant={copied === m.url ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => copyUrl(m.url)}
                      className={`flex-1 gap-1 h-7 text-[11px] font-medium transition ${
                        copied === m.url
                          ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
                          : ''
                      }`}
                      title="Copy URL to clipboard to paste in pages, banners or logo"
                    >
                      {copied === m.url ? (
                        <Check className="h-3 w-3 text-white" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copied === m.url ? 'Copied!' : 'Copy URL'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(m)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                      title="Edit image name or replace image"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(m.id, m.name)}
                      className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      title="Delete this image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal for previewing full image */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold truncate max-w-md">
                  {previewMedia.name}
                </h3>
                <p className="text-[11px] font-mono text-muted-foreground">
                  {previewMedia.url}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const toEdit = previewMedia;
                    setPreviewMedia(null);
                    openEditModal(toEdit);
                  }}
                  className="gap-1 h-8 text-xs text-primary border-primary/30 hover:bg-primary/10"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyUrl(previewMedia.url)}
                  className="gap-1 h-8 text-xs"
                >
                  {copied === previewMedia.url ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied === previewMedia.url ? 'Copied URL!' : 'Copy URL'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPreviewMedia(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid place-items-center py-4 bg-muted/20 rounded-xl mt-3 max-h-[70vh] overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewMedia.url}
                alt={previewMedia.name}
                className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg shadow"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit / Update Media Item Modal */}
      {editingMedia && (
        <div
          onClick={() => setEditingMedia(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-lg w-full overflow-hidden rounded-2xl border border-border bg-background p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Pencil className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Update Media Item</h3>
                  <p className="text-[11px] text-muted-foreground">Rename or replace this media asset</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingMedia(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleUpdateMedia} className="space-y-4">
              {/* Preview Thumbnail */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/40 border border-border">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-background border border-border flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editReplacementPreview || editUrl || editingMedia.url}
                    alt="Preview"
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{editingMedia.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground truncate">{editingMedia.url}</p>
                  {editReplacementFile && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                      <Check className="h-3 w-3" /> New file chosen ({formatBytes(editReplacementFile.size)})
                    </span>
                  )}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-xs font-medium">Image Name / Title</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Grand Entrance Gate"
                  className="h-9 text-xs"
                  required
                />
              </div>

              {/* Replace Image Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Replace Image (Optional)</Label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditTab('upload')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        editTab === 'upload' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditTab('url')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        editTab === 'url' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {editTab === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={(e) => e.target.files?.[0] && handleReplacementFile(e.target.files[0])}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                      className="hidden"
                    />
                    <div
                      onClick={() => editFileInputRef.current?.click()}
                      className="cursor-pointer rounded-xl border border-dashed border-border bg-muted/20 p-3.5 text-center hover:bg-muted/40 transition"
                    >
                      <Upload className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
                      <p className="text-xs font-medium text-foreground">
                        {editReplacementFile ? editReplacementFile.name : 'Click to select a replacement file'}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        PNG, JPG, WebP, SVG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <Input
                    value={editUrl}
                    onChange={(e) => {
                      setEditUrl(e.target.value);
                      setEditReplacementFile(null);
                      setEditReplacementPreview(null);
                    }}
                    placeholder="https://images.pexels.com/... or /assets/..."
                    className="h-9 text-xs font-mono"
                  />
                )}
              </div>

              {editError && (
                <p className="text-xs text-destructive font-medium bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">
                  {editError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMedia(null)}
                  disabled={savingEdit}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={savingEdit || !editName.trim()}
                  className="h-8 gap-1.5 text-xs"
                >
                  {savingEdit ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  {savingEdit ? 'Updating...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
