'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
// @ts-expect-error SweetAlert2's stylesheet has no TypeScript declarations.
import 'sweetalert2/dist/sweetalert2.min.css';
import { logActivity } from '@/lib/admin';
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
  ArrowLeft,
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
  return match ? match[1].toUpperCase() : 'JPG';
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
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

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

      // Clear broken image status if updated
      setImgErrors((prev) => {
        const next = { ...prev };
        delete next[editingMedia.id];
        return next;
      });

      if (previewMedia?.id === editingMedia.id) {
        setPreviewMedia((prev) => (prev ? { ...prev, ...updated.item } : null));
      }

      setEditingMedia(null);
      setEditReplacementFile(null);
      setEditReplacementPreview(null);

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Media updated successfully',
        showConfirmButton: false,
        timer: 2000,
      });
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
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `${successCount} ${successCount === 1 ? 'image' : 'images'} uploaded`,
          showConfirmButton: false,
          timer: 2000,
        });
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
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Image URL imported successfully',
          showConfirmButton: false,
          timer: 2000,
        });
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

  // Handle Media deletion with confirmation
  async function remove(id: string, n: string) {
    const result = await Swal.fire({
      title: 'Delete Image?',
      text: `Are you sure you want to remove "${n}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl text-xs font-bold px-4 py-2',
        cancelButton: 'rounded-xl text-xs font-semibold px-4 py-2',
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await logActivity('delete', 'media', n, id);
        setRows((prev) => prev.filter((r) => r.id !== id));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Image removed',
          showConfirmButton: false,
          timer: 1800,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to delete media item.',
        });
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

  const filtered = rows.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Back Navigation Button */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>
      </div>

      {/* Main Header */}
      <div className="flex items-start gap-3.5">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-sm">
          <ImageIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Media Library</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload images directly from your device or import external URLs to reuse across pages, banners, blogs, and footer.
          </p>
        </div>
      </div>

      {/* Main Upload Box Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
        {/* Tab switch: Upload from device vs Import URL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition ${
                tab === 'upload'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <Upload className="h-3.5 w-3.5" /> Upload from Device
            </button>
            <button
              type="button"
              onClick={() => setTab('url')}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition ${
                tab === 'url'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" /> Import from URL
            </button>
          </div>
          <span className="text-xs text-slate-400 font-medium">
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
              className={`rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                isDragging
                  ? 'border-blue-500 bg-blue-100/60 scale-[0.99]'
                  : 'border-blue-200/90 bg-blue-50/40 hover:bg-blue-50/70 hover:border-blue-400'
              }`}
            >
              <div className="h-14 w-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md mb-3">
                {uploading ? (
                  <Loader2 className="h-7 w-7 animate-spin" />
                ) : (
                  <Upload className="h-7 w-7" />
                )}
              </div>
              <p className="text-sm font-bold text-slate-800">
                {uploading
                  ? 'Uploading images to server...'
                  : 'Click to browse files or drag & drop images here'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                You can select multiple files at once. PNG, JPG, WebP, SVG or GIF.
              </p>
              <button
                type="button"
                disabled={uploading}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition pointer-events-none"
              >
                <FileImage className="h-4 w-4 text-slate-500" /> Browse from Computer
              </button>
            </div>
          </div>
        ) : (
          /* External URL Input Form */
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Name (optional)</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Master Bedroom View"
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Image URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/... or https://..."
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addUrl}
              disabled={addingUrl || !urlInput.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition"
            >
              {addingUrl ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LinkIcon className="h-3.5 w-3.5" />
              )}
              {addingUrl ? 'Saving...' : 'Add Image URL to Library'}
            </button>
          </div>
        )}

        {uploadError && (
          <div className="text-xs text-rose-600 font-medium bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center justify-between">
            <span>{uploadError}</span>
            <button
              type="button"
              onClick={() => setUploadError('')}
              className="text-rose-400 hover:text-rose-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Gallery Header & Search Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Stored Media</h2>
          <span className="rounded-full bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 text-xs font-bold text-indigo-600">
            {rows.length} {rows.length === 1 ? 'image' : 'images'}
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search image by name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition"
          />
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500 mt-2 font-medium">Loading media library...</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-blue-600 mb-3">
            <ImageIcon className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No media uploaded yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Drag & drop images above or click Browse to upload your project images, banners, and logos.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Upload className="h-3.5 w-3.5" /> Upload your first image
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          No media matching &quot;{search}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((m) => {
            const ext = getFileExtension(m.url, m.name);
            const sizeStr = formatBytes(m.size);
            const isBroken = Boolean(imgErrors[m.id]);

            return (
              <div
                key={m.id}
                className="group relative flex flex-col rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all"
              >
                {/* Image Preview Container */}
                <div
                  onClick={() => !isBroken && setPreviewMedia(m)}
                  className={`relative h-36 w-full overflow-hidden bg-slate-50 flex items-center justify-center border-b border-slate-100 ${
                    isBroken ? 'cursor-default' : 'cursor-pointer'
                  }`}
                  title={isBroken ? 'Image could not be loaded' : 'Click to preview full size'}
                >
                  {/* Top-left format & size badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="rounded bg-slate-900/85 text-white text-[10px] font-bold px-2 py-0.5 tracking-wider backdrop-blur-xs shadow-xs">
                      {ext}{sizeStr ? ` ${sizeStr}` : ''}
                    </span>
                  </div>

                  {isBroken ? (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400 bg-slate-100/90 w-full h-full select-none">
                      <ImageIcon className="h-8 w-8 text-slate-300 stroke-[1.5]" />
                      <span className="text-xs font-medium text-slate-400">Broken Image</span>
                    </div>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.url}
                        alt={m.name}
                        className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={() => setImgErrors((prev) => ({ ...prev, [m.id]: true }))}
                      />
                      {/* Hover overlay with preview icon */}
                      <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-sm flex items-center gap-1">
                          <Maximize2 className="h-3 w-3" /> View
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Media Details */}
                <div className="p-3 pb-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="truncate text-xs font-bold text-slate-800" title={m.name}>
                      {m.name}
                    </p>
                    <p
                      className="truncate text-[10px] font-mono text-slate-400 mt-0.5 select-all"
                      title={m.url}
                    >
                      {m.url}
                    </p>
                  </div>

                  {/* Action Row */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => copyUrl(m.url)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
                      title="Copy URL"
                    >
                      {copied === m.url ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold text-xs">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(m)}
                        className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Edit image"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(m.id, m.name)}
                        className="p-1 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Delete image"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
            className="relative max-h-[90vh] max-w-4xl w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="min-w-0 pr-4">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {previewMedia.name}
                </h3>
                <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                  {previewMedia.url}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = previewMedia;
                    setPreviewMedia(null);
                    openEditModal(toEdit);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Pencil className="h-3 w-3 text-slate-500" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => copyUrl(previewMedia.url)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  {copied === previewMedia.url ? (
                    <Check className="h-3 w-3 text-white" />
                  ) : (
                    <Copy className="h-3 w-3 text-white" />
                  )}
                  {copied === previewMedia.url ? 'Copied URL!' : 'Copy URL'}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMedia(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid place-items-center py-4 bg-slate-50 rounded-xl max-h-[65vh] overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewMedia.url}
                alt={previewMedia.name}
                className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
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
            className="relative max-h-[90vh] max-w-lg w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Pencil className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Update Media Item</h3>
                  <p className="text-[11px] text-slate-400">Rename or replace this media asset</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateMedia} className="space-y-4">
              {/* Preview Thumbnail */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editReplacementPreview || editUrl || editingMedia.url}
                    alt="Preview"
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{editingMedia.name}</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                    {editingMedia.url}
                  </p>
                  {editReplacementFile && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                      <Check className="h-3 w-3" /> New file chosen (
                      {formatBytes(editReplacementFile.size)})
                    </span>
                  )}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Image Name / Title</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Grand Entrance Gate"
                  className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                  required
                />
              </div>

              {/* Replace Image Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Replace Image (Optional)</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditTab('upload')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                        editTab === 'upload'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditTab('url')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                        editTab === 'url'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-500 hover:bg-slate-100'
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
                      onChange={(e) =>
                        e.target.files?.[0] && handleReplacementFile(e.target.files[0])
                      }
                      accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                      className="hidden"
                    />
                    <div
                      onClick={() => editFileInputRef.current?.click()}
                      className="cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-3.5 text-center hover:bg-slate-100/70 transition"
                    >
                      <Upload className="mx-auto h-4 w-4 text-slate-400 mb-1" />
                      <p className="text-xs font-semibold text-slate-700">
                        {editReplacementFile
                          ? editReplacementFile.name
                          : 'Click to select a replacement file'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG, WebP, SVG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editUrl}
                    onChange={(e) => {
                      setEditUrl(e.target.value);
                      setEditReplacementFile(null);
                      setEditReplacementPreview(null);
                    }}
                    placeholder="https://images.pexels.com/... or /assets/..."
                    className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
                  />
                )}
              </div>

              {editError && (
                <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {editError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || !editName.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition"
                >
                  {savingEdit ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  {savingEdit ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
