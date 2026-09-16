"use client";

import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { AdminImagePreview, ImageSizeGuide } from "@/components/admin-image-preview";
import { useResolvedLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { parseImageUrls, safeImageSrc, siteImages } from "@/lib/media";
import { mediaCopy } from "@/lib/media-copy";

type UploadTarget = "cover" | "gallery" | number;
type MediaEditorProps = {
  coverImage: string;
  galleryImages: string;
  onCoverChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
  onGalleryTextChange: (text: string) => void;
  onBusyChange: (busy: boolean) => void;
};

function FilePicker({ label, multiple = false, disabled, onFiles }: {
  label: string; multiple?: boolean; disabled: boolean; onFiles: (files: File[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return <>
    <Button type="button" size="sm" disabled={disabled} onClick={() => input.current?.click()}><Upload size={14} aria-hidden="true" />{label}</Button>
    <input ref={input} type="file" accept="image/*" multiple={multiple} disabled={disabled} hidden
      aria-label={label} onChange={(event) => {
        const files = Array.from(event.currentTarget.files ?? []);
        event.currentTarget.value = "";
        if (files.length) onFiles(files);
      }} />
  </>;
}

export function AdminMediaEditor({ coverImage, galleryImages, onCoverChange, onGalleryChange, onGalleryTextChange, onBusyChange }: MediaEditorProps) {
  const copy = mediaCopy[useResolvedLocale()];
  const id = useId();
  const gallery = parseImageUrls(galleryImages);
  const uploadController = useRef<AbortController | null>(null);
  const objectUrls = useRef<string[]>([]);
  const [pending, setPending] = useState<{ src: string; name: string }[]>([]);
  const [target, setTarget] = useState<UploadTarget>("gallery");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [urlDraft, setUrlDraft] = useState("");
  const busy = pending.length > 0;

  function releasePreviews() {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current = [];
  }

  useEffect(() => () => {
    // Switching projects must never attach an old upload to the new draft.
    uploadController.current?.abort();
    releasePreviews();
    onBusyChange(false);
  }, [onBusyChange]);

  async function upload(files: File[], destination: UploadTarget) {
    if (uploadController.current) return;
    const selected = destination === "gallery" ? files : files.slice(0, 1);
    if (!selected.length) return;
    if (selected.some((file) => !file.type.startsWith("image/"))) {
      setError(copy.invalidFile);
      return;
    }

    const controller = new AbortController();
    uploadController.current = controller;
    const previews = selected.map((file) => ({ src: URL.createObjectURL(file), name: file.name }));
    objectUrls.current = previews.map((preview) => preview.src);
    setPending(previews);
    setTarget(destination);
    setProgress(0);
    setError("");
    onBusyChange(true);
    const uploaded: string[] = [];

    try {
      // Preserve the selection order, even when files take different times to upload.
      for (const file of selected) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/uploads", { method: "POST", body, signal: controller.signal });
        const payload = await response.json() as { url?: string; error?: string };
        if (!response.ok || !payload.url || !safeImageSrc(payload.url)) throw new Error(payload.error || copy.uploadFailed);
        uploaded.push(payload.url);
        setProgress(uploaded.length);
      }
    } catch (uploadError) {
      if (!controller.signal.aborted) {
        const detail = uploadError instanceof Error && uploadError.message !== copy.uploadFailed ? uploadError.message : "";
        setError(detail ? `${copy.uploadFailed} ${detail}` : copy.uploadFailed);
      }
    } finally {
      if (!controller.signal.aborted) {
        if (uploaded.length) {
          if (destination === "cover") onCoverChange(uploaded[0]);
          else if (destination === "gallery") onGalleryChange([...gallery, ...uploaded]);
          else onGalleryChange(gallery.map((url, index) => index === destination ? uploaded[0] : url));
        }
        releasePreviews();
        setPending([]);
        uploadController.current = null;
        onBusyChange(false);
      }
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    const next = [...gallery];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    onGalleryChange(next);
  }

  function addUrl() {
    const url = safeImageSrc(urlDraft);
    if (!url || url.startsWith("blob:")) { setError(copy.invalidUrl); return; }
    onGalleryChange([...gallery, url]);
    setUrlDraft("");
    setError("");
  }

  const uploadStatus = busy && <p className="admin-upload-progress" role="status">
    <LoaderCircle size={16} className="admin-upload-spinner" aria-hidden="true" />
    {copy.uploading} {Math.min(progress + 1, pending.length)}/{pending.length}: {pending[Math.min(progress, pending.length - 1)].name}
  </p>;

  return <section className="admin-media-editor full-span" aria-labelledby={`${id}-heading`}>
    <div className="admin-media-heading"><h3 id={`${id}-heading`}>{copy.media}</h3><span>{copy.shared}</span></div>
    <p className="admin-media-hint">{copy.fileGuide}</p>
    <div className="admin-media-block">
      <h4>{copy.cover}</h4><p className="admin-media-hint">{copy.coverUse}</p>
      <ImageSizeGuide usage="cover" />
      <AdminImagePreview src={busy && target === "cover" ? pending[0].src : coverImage} label={copy.cover} usage="cover" />
      <div className="admin-media-actions">
        <FilePicker label={coverImage ? copy.replace : copy.upload} disabled={busy} onFiles={(files) => void upload(files, "cover")} />
        {coverImage && <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => onCoverChange("")}><Trash2 size={14} aria-hidden="true" />{copy.remove}</Button>}
      </div>
      {target === "cover" && uploadStatus}
      <label className="admin-media-url"><span>{copy.imageUrl}</span><input value={coverImage} disabled={busy}
        placeholder="https://..." onChange={(event) => onCoverChange(event.target.value)} /></label>
    </div>

    <div className="admin-media-block">
      <div className="admin-media-heading"><h4>{copy.gallery}<span className="admin-media-count">{gallery.length}</span></h4>
        <FilePicker label={copy.add} multiple disabled={busy} onFiles={(files) => void upload(files, "gallery")} />
      </div>
      <p className="admin-media-hint">{copy.galleryUse}</p><ImageSizeGuide usage="gallery" />
      {target !== "cover" && uploadStatus}
      <div className="admin-gallery-previews">
        {gallery.map((url, index) => <article key={`${url}-${index}`} className="admin-gallery-item" aria-label={`${copy.image} ${index + 1}`}>
          <div className="admin-gallery-item__heading"><h5>{copy.image} {index + 1}</h5><div className="admin-gallery-order">
            <Button type="button" variant="ghost" size="icon" disabled={busy || index === 0} onClick={() => moveImage(index, -1)} aria-label={`${copy.moveUp}: ${copy.image} ${index + 1}`} title={copy.moveUp}><ArrowUp size={15} aria-hidden="true" /></Button>
            <Button type="button" variant="ghost" size="icon" disabled={busy || index === gallery.length - 1} onClick={() => moveImage(index, 1)} aria-label={`${copy.moveDown}: ${copy.image} ${index + 1}`} title={copy.moveDown}><ArrowDown size={15} aria-hidden="true" /></Button>
          </div></div>
          <AdminImagePreview src={busy && target === index ? pending[0].src : url} label={`${copy.image} ${index + 1}`} usage="gallery" />
          <div className="admin-media-actions">
            <FilePicker label={copy.replace} disabled={busy} onFiles={(files) => void upload(files, index)} />
            <Button type="button" size="icon" variant="outline" disabled={busy} onClick={() => onGalleryChange(gallery.filter((_, i) => i !== index))} aria-label={`${copy.remove}: ${copy.image} ${index + 1}`} title={copy.remove}><Trash2 size={15} aria-hidden="true" /></Button>
          </div>
        </article>)}
        {busy && target === "gallery" && pending.map((preview) => <article key={preview.src} className="admin-gallery-item is-pending">
          <h5>{copy.pending}: {preview.name}</h5><AdminImagePreview src={preview.src} label={preview.name} usage="gallery" />
        </article>)}
      </div>
      {!gallery.length && !busy && <div className="admin-gallery-empty"><ImagePlus size={24} aria-hidden="true" /><span>{copy.empty}</span></div>}
      <div className="admin-gallery-add-url"><label><span>{copy.imageUrl}</span><input value={urlDraft} disabled={busy} placeholder="https://..."
        onChange={(event) => setUrlDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addUrl(); } }} /></label>
        <Button type="button" variant="outline" size="sm" disabled={busy || !urlDraft.trim()} onClick={addUrl}>{copy.addUrl}</Button>
      </div>
      <details className="admin-gallery-urls"><summary>{copy.urls}</summary><label><span>{copy.urlsHelp}</span>
        <textarea rows={4} disabled={busy} value={galleryImages} onChange={(event) => onGalleryTextChange(event.target.value)} />
      </label></details>
    </div>
    {error && <p className="admin-media-error" role="alert">{error}</p>}
    <p className="admin-media-hint">{copy.saveHint}</p>
  </section>;
}

export function AdminSitePortraits() {
  const copy = mediaCopy[useResolvedLocale()];
  return <section className="admin-media-editor full-span" aria-label={copy.portraits}>
    <div className="admin-media-heading"><h3>{copy.portraits}</h3></div><p className="admin-media-hint">{copy.portraitsHint}</p>
    <ImageSizeGuide usage="portrait" />
    <div className="admin-site-portraits">{[
      { src: siteImages.heroPortrait, label: copy.heroPortrait },
      { src: siteImages.aboutPortrait, label: copy.aboutPortrait }
    ].map((portrait) => <div key={portrait.src}><h4>{portrait.label}</h4><AdminImagePreview {...portrait} usage="portrait" /></div>)}</div>
  </section>;
}
