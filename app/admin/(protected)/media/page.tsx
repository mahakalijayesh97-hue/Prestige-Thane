'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
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
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  ExternalLink,
  Download,
  CheckSquare,
  Square,
  Sparkles,
  HardDrive,
  RefreshCw,
  FolderArchive,
  Eye,
  CheckCheck,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

interface Media {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number | null;
  created_at: string;
}

type FormatFilter = 'ALL' | 'PNG' | 'WEBP' | 'JPG' | 'SVG' | 'OTHER';
type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-desc' | 'size-asc';
type ViewMode = 'grid' | 'list';

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

function getFormatBadgeColor(ext: string): { bg: string; text: string; border: string } {
  switch (ext.toUpperCase()) {
    case 'PNG':
      return { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-800' };
    case 'WEBP':
      return { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-800' };
    case 'JPG':
    case 'JPEG':
      return { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-800' };
    case 'SVG':
      return { bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-300 dark:border-cyan-800' };
    default:
      return { bg: 'bg-slate-500/10 dark:bg-slate-500/20', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-800' };
  }
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
  const [uploaderExpanded, setUploaderExpanded] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Filters, Sort & View Modes
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
          title: `${successCount} ${successCount === 1 ? 'image' : 'images'} uploaded successfully`,
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
      text: `Are you sure you want to remove "${n}" from your media library?`,
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
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
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

  // Handle Batch Deletion
  async function handleBatchDelete() {
    if (selectedIds.length === 0) return;

    const result = await Swal.fire({
      title: `Delete ${selectedIds.length} Images?`,
      text: 'Selected images will be permanently removed from storage and database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Delete ${selectedIds.length} items`,
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl text-xs font-bold px-4 py-2',
        cancelButton: 'rounded-xl text-xs font-semibold px-4 py-2',
      },
    });

    if (!result.isConfirmed) return;

    let deletedCount = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (res.ok) deletedCount++;
      } catch {}
    }

    setRows((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    await logActivity('delete', 'media', `Batch deleted ${deletedCount} images`);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${deletedCount} images removed`,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  // Copy selected URLs
  function copySelectedUrls() {
    const selectedUrls = rows
      .filter((r) => selectedIds.includes(r.id))
      .map((r) => r.url)
      .join('\n');
    navigator.clipboard.writeText(selectedUrls);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${selectedIds.length} URLs copied to clipboard`,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  function copyUrl(u: string) {
    navigator.clipboard.writeText(u);
    setCopied(u);
    setTimeout(() => setCopied(null), 1800);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function toggleSelectAll(filteredItems: Media[]) {
    if (selectedIds.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  }

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
        title: 'Media asset updated successfully',
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

  // Filter & Sort Pipeline
  const filtered = rows.filter((m) => {
    // 1. Text Search
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      m.name.toLowerCase().includes(term) ||
      m.url.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    // 2. Format filter
    if (formatFilter === 'ALL') return true;
    const ext = getFileExtension(m.url, m.name).toUpperCase();
    if (formatFilter === 'JPG') return ext === 'JPG' || ext === 'JPEG';
    if (formatFilter === 'OTHER') return !['PNG', 'WEBP', 'JPG', 'JPEG', 'SVG'].includes(ext);
    return ext === formatFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    if (sortBy === 'size-desc') {
      return (b.size || 0) - (a.size || 0);
    }
    if (sortBy === 'size-asc') {
      return (a.size || 0) - (b.size || 0);
    }
    return 0;
  });

  // Calculate statistics
  const totalSizeBytes = rows.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const totalSizeFormatted = formatBytes(totalSizeBytes) || '0 KB';
  const pngCount = rows.filter((r) => getFileExtension(r.url, r.name) === 'PNG').length;
  const webpCount = rows.filter((r) => getFileExtension(r.url, r.name) === 'WEBP').length;
  const jpgCount = rows.filter((r) => ['JPG', 'JPEG'].includes(getFileExtension(r.url, r.name))).length;

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-5">
        <div className="space-y-3">
          {/* Breadcrumbs & Back link */}
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground hover:border-primary/40 transition shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-primary" />
              <span>Back to Admin</span>
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-muted-foreground font-medium">Dashboard</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-semibold text-foreground">Media Library</span>
          </div>

          {/* Title with Badge & Icon */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary border border-primary/20 shadow-xs">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-normal sm:leading-snug py-0.5">
                  Media Library
                </h1>
                <span className="rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {rows.length} {rows.length === 1 ? 'Asset' : 'Assets'}
                </span>
                <span className="rounded-full bg-muted/60 border border-border px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
                  {totalSizeFormatted}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload, manage, and optimize images, banners, floor plans, and logos used across your site.
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition cursor-pointer"
            title="Refresh media list"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setUploaderExpanded(true);
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Images</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="p-4 border border-border/80 bg-card rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Total Assets</span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <FolderArchive className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-foreground">{rows.length}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground truncate">
            {rows.length > 0 ? 'Ready for production use' : 'No images stored'}
          </div>
        </div>

        <div className="p-4 border border-border/80 bg-card rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Storage Size</span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/10 text-blue-600">
              <HardDrive className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-foreground">{totalSizeFormatted}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground truncate">
            Local storage in <code>/public/uploads</code>
          </div>
        </div>

        <div className="p-4 border border-border/80 bg-card rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Format Breakdown</span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-foreground">
            {pngCount} PNG • {webpCount} WebP
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground truncate">
            Plus {jpgCount} JPG/JPEG images
          </div>
        </div>

        <div className="p-4 border border-border/80 bg-card rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Image Delivery</span>
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-xl font-extrabold text-foreground">Next.js Cache</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground truncate">
            Full static optimization & CDN
          </div>
        </div>
      </div>

      {/* Upload & Import Station Card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border">
              <button
                type="button"
                onClick={() => setTab('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  tab === 'upload'
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload from Device</span>
              </button>
              <button
                type="button"
                onClick={() => setTab('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  tab === 'url'
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Import from URL</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Max: 5MB • PNG, JPG, WebP, SVG, GIF</span>
            <button
              type="button"
              onClick={() => setUploaderExpanded(!uploaderExpanded)}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              title={uploaderExpanded ? 'Collapse uploader' : 'Expand uploader'}
            >
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${uploaderExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {uploaderExpanded && (
          <div className="animate-in fade-in duration-200">
            {tab === 'upload' ? (
              /* Drag-and-Drop / File Picker Zone */
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
                  className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? 'border-primary bg-primary/10 scale-[0.99] ring-2 ring-primary/30'
                      : 'border-border/80 bg-muted/20 hover:bg-muted/40 hover:border-primary/50'
                  }`}
                >
                  <div className="h-13 w-13 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs mb-3">
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Upload className="h-6 w-6" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {uploading
                      ? 'Uploading images to server...'
                      : 'Click to browse files or drag & drop images here'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select one or multiple files at once. PNG, JPG, WebP, SVG, or GIF.
                  </p>
                  <button
                    type="button"
                    disabled={uploading}
                    className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground shadow-2xs hover:bg-muted transition pointer-events-none"
                  >
                    <FileImage className="h-3.5 w-3.5 text-primary" />
                    <span>Browse from Computer</span>
                  </button>
                </div>
              </div>
            ) : (
              /* External URL Input Form */
              <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Asset Name (optional)</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Master Bedroom View"
                      className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-foreground">
                      Image URL <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/... or https://..."
                      className="w-full h-9 rounded-xl border border-border bg-background px-3 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition shadow-2xs"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addUrl}
                  disabled={addingUrl || !urlInput.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs disabled:opacity-50 transition cursor-pointer"
                >
                  {addingUrl ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <LinkIcon className="h-3.5 w-3.5" />
                  )}
                  <span>{addingUrl ? 'Saving...' : 'Add Image URL to Library'}</span>
                </button>
              </div>
            )}

            {uploadError && (
              <div className="mt-3 text-xs text-destructive font-medium bg-destructive/10 p-3 rounded-xl border border-destructive/20 flex items-center justify-between">
                <span>{uploadError}</span>
                <button
                  type="button"
                  onClick={() => setUploadError('')}
                  className="text-destructive/70 hover:text-destructive cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gallery Header, Format Filter Pills, Sort & View Mode Switches */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Format Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'ALL', label: `All (${rows.length})` },
                { id: 'PNG', label: `PNG (${pngCount})` },
                { id: 'WEBP', label: `WebP (${webpCount})` },
                { id: 'JPG', label: `JPG (${jpgCount})` },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setFormatFilter(filter.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  formatFilter === filter.id
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search, Sort Dropdown & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search image name or URL..."
                className="w-full pl-8.5 pr-8 py-1.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-8.5 rounded-xl border border-border bg-card px-2.5 text-xs font-semibold text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="size-desc">Sort: Size (Largest)</option>
              <option value="size-asc">Sort: Size (Smallest)</option>
            </select>

            {/* View Mode Toggle: Grid vs List */}
            <div className="flex items-center rounded-xl border border-border bg-card p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Grid Gallery View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Compact List View"
              >
                <ListIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Batch Selection Banner */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/10 text-xs font-bold text-primary animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span>{selectedIds.length} images selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copySelectedUrls}
                className="px-2.5 py-1 rounded-lg bg-background text-foreground border border-border hover:bg-muted transition text-xs font-semibold"
              >
                Copy Selected URLs
              </button>
              <button
                type="button"
                onClick={handleBatchDelete}
                className="px-2.5 py-1 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition text-xs font-semibold"
              >
                Delete Selected
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Gallery Area */}
      {loading ? (
        <div className="grid place-items-center py-24 border border-border rounded-2xl bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground mt-2 font-medium">Loading media library...</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-14 text-center rounded-2xl border-2 border-dashed border-border bg-card">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary mb-3">
            <ImageIcon className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">No media assets found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Drag & drop images above or click Browse to upload your project photos, site plans, banners, and logos.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" /> Upload your first image
          </button>
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-xs text-muted-foreground">
          No media matching &ldquo;{search}&rdquo; with format filter &ldquo;{formatFilter}&rdquo;.
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sorted.map((m) => {
            const ext = getFileExtension(m.url, m.name);
            const sizeStr = formatBytes(m.size);
            const isBroken = Boolean(imgErrors[m.id]);
            const badgeTheme = getFormatBadgeColor(ext);
            const isSelected = selectedIds.includes(m.id);

            return (
              <div
                key={m.id}
                className={`group relative flex flex-col rounded-2xl border bg-card overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 ${
                  isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border/90'
                }`}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-2.5 right-2.5 z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(m.id);
                    }}
                    className={`h-5 w-5 rounded-md flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-black/70'
                    }`}
                  >
                    {isSelected ? <Check className="h-3 w-3 stroke-[3]" /> : <Square className="h-3 w-3" />}
                  </button>
                </div>

                {/* Image Preview Container with Transparent-friendly Checkerboard */}
                <div
                  onClick={() => !isBroken && setPreviewMedia(m)}
                  className={`relative h-36 w-full overflow-hidden bg-muted/30 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:10px_10px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] flex items-center justify-center border-b border-border/80 ${
                    isBroken ? 'cursor-default' : 'cursor-pointer'
                  }`}
                  title={isBroken ? 'Image could not be loaded' : 'Click to preview full size'}
                >
                  {/* Top-left format & size badge */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
                    <span
                      className={`rounded-md border ${badgeTheme.border} ${badgeTheme.bg} ${badgeTheme.text} text-[9px] font-extrabold px-1.5 py-0.5 tracking-wider shadow-2xs`}
                    >
                      {ext}
                    </span>
                    {sizeStr && (
                      <span className="rounded-md bg-black/75 text-white text-[9px] font-mono font-medium px-1.5 py-0.5 shadow-2xs">
                        {sizeStr}
                      </span>
                    )}
                  </div>

                  {isBroken ? (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground bg-muted/60 w-full h-full select-none">
                      <ImageIcon className="h-7 w-7 text-muted-foreground/40 stroke-[1.5]" />
                      <span className="text-[11px] font-medium text-muted-foreground">Broken Link</span>
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
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="rounded-lg bg-background/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-sm flex items-center gap-1">
                          <Maximize2 className="h-3 w-3" /> View
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Media Details */}
                <div className="p-3 pb-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="truncate text-xs font-bold text-foreground" title={m.name}>
                      {m.name}
                    </p>
                    <p
                      className="truncate text-[10px] font-mono text-muted-foreground mt-0.5 select-all"
                      title={m.url}
                    >
                      {m.url}
                    </p>
                  </div>

                  {/* Action Row */}
                  <div className="mt-3 pt-2 border-t border-border/70 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => copyUrl(m.url)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition cursor-pointer"
                      title="Copy URL"
                    >
                      {copied === m.url ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(m)}
                        className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition cursor-pointer"
                        title="Edit image details"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(m.id, m.name)}
                        className="p-1 rounded-md text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
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
      ) : (
        /* LIST / TABLE VIEW */
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={() => toggleSelectAll(sorted)}
                      className="cursor-pointer"
                    >
                      {selectedIds.length === sorted.length && sorted.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </th>
                  <th className="p-3 w-16">Preview</th>
                  <th className="p-3">Asset Name</th>
                  <th className="p-3 w-24">Format</th>
                  <th className="p-3 w-28">File Size</th>
                  <th className="p-3 w-36">URL Path</th>
                  <th className="p-3 text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {sorted.map((m) => {
                  const ext = getFileExtension(m.url, m.name);
                  const sizeStr = formatBytes(m.size);
                  const isSelected = selectedIds.includes(m.id);
                  const badgeTheme = getFormatBadgeColor(ext);

                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-muted/30 transition ${isSelected ? 'bg-primary/5' : ''}`}
                    >
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelect(m.id)}
                          className="cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <div
                          onClick={() => setPreviewMedia(m)}
                          className="h-10 w-12 rounded-lg bg-muted/40 border border-border overflow-hidden cursor-pointer flex items-center justify-center p-0.5"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.url}
                            alt={m.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="p-3 font-bold text-foreground">
                        <div className="truncate max-w-xs">{m.name}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded border ${badgeTheme.border} ${badgeTheme.bg} ${badgeTheme.text} text-[10px] font-bold px-1.5 py-0.5`}
                        >
                          {ext}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-muted-foreground">
                        {sizeStr || '—'}
                      </td>
                      <td className="p-3 font-mono text-muted-foreground">
                        <div className="truncate max-w-[180px]">{m.url}</div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => copyUrl(m.url)}
                            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted transition cursor-pointer"
                            title="Copy URL"
                          >
                            {copied === m.url ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(m)}
                            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted transition cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(m.id, m.name)}
                            className="p-1.5 rounded-lg border border-border text-destructive hover:bg-destructive/10 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
            className="relative max-h-[92vh] max-w-4xl w-full overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="min-w-0 pr-4">
                <h3 className="text-sm font-bold text-foreground truncate">
                  {previewMedia.name}
                </h3>
                <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
                  {previewMedia.url}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewMedia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Open Full</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = previewMedia;
                    setPreviewMedia(null);
                    openEditModal(toEdit);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                >
                  <Pencil className="h-3 w-3 text-muted-foreground" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => copyUrl(previewMedia.url)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  {copied === previewMedia.url ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copied === previewMedia.url ? 'Copied URL!' : 'Copy URL'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMedia(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid place-items-center py-4 bg-muted/20 rounded-xl max-h-[65vh] overflow-auto border border-border">
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
            className="relative max-h-[90vh] max-w-lg w-full overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Pencil className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Update Media Item</h3>
                  <p className="text-[11px] text-muted-foreground">Rename or replace this media asset</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateMedia} className="space-y-4">
              {/* Preview Thumbnail */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/30 border border-border">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-background border border-border flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editReplacementPreview || editUrl || editingMedia.url}
                    alt="Preview"
                    className="h-full w-full object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate">{editingMedia.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground truncate">{editingMedia.url}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatBytes(editingMedia.size) || 'Unknown size'}
                  </p>
                </div>
              </div>

              {/* Asset Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Asset Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Master Bedroom View"
                  className="w-full h-9 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                  required
                />
              </div>

              {/* Replacement Tabs: File Upload vs URL */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">Replace Image (optional)</label>
                  <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-muted/40">
                    <button
                      type="button"
                      onClick={() => setEditTab('upload')}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition ${
                        editTab === 'upload' ? 'bg-background shadow-2xs text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      File
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditTab('url')}
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition ${
                        editTab === 'url' ? 'bg-background shadow-2xs text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {editTab === 'upload' ? (
                  <div>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleReplacementFile(e.target.files?.[0])}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="w-full h-16 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 flex flex-col items-center justify-center text-center cursor-pointer transition text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      <Upload className="h-4 w-4 mb-1 text-primary" />
                      <span>{editReplacementFile ? editReplacementFile.name : 'Click to select replacement file'}</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full h-9 rounded-xl border border-border bg-background px-3 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                    />
                  </div>
                )}
              </div>

              {editError && (
                <div className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20">
                  {editError}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs disabled:opacity-50 transition cursor-pointer"
                >
                  {savingEdit ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>{savingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
