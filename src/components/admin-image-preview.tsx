"use client";

import { ArrowUpRight, Check, ImageOff, ImagePlus, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useResolvedLocale } from "@/components/locale-provider";
import { imageAspectRatio, imageGuides, safeImageSrc, type ImageUsage } from "@/lib/media";
import { mediaCopy } from "@/lib/media-copy";

type ImagePreviewProps = { src: string; label: string; usage: ImageUsage; compact?: boolean };

export function AdminImagePreview(props: ImagePreviewProps) {
  return <ImagePreview key={props.src.trim()} {...props} />;
}

function ImagePreview({ src, label, usage, compact = false }: ImagePreviewProps) {
  const copy = mediaCopy[useResolvedLocale()];
  const imageRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const source = safeImageSrc(src);
  const guide = imageGuides[usage];
  const hasError = failed || Boolean(src.trim() && !source);
  const small = dimensions && (dimensions.width < guide.minWidth || dimensions.height < guide.minHeight);
  const letterboxed = dimensions && guide.ratio !== null && Math.abs(dimensions.width / dimensions.height - guide.ratio) > 0.03;

  function readDimensions(image: HTMLImageElement) {
    if (image.naturalWidth > 0) setDimensions({ width: image.naturalWidth, height: image.naturalHeight });
  }

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete) {
      if (image.naturalWidth > 0) readDimensions(image);
      else setFailed(true);
    }
  }, []);

  return (
    <div className={`admin-image-preview admin-image-preview--${usage}${compact ? " admin-image-preview--compact" : ""}`}>
      <div className="admin-image-preview__frame">
        {source && !hasError ? <img ref={imageRef} src={source} alt={label}
          onLoad={(event) => readDimensions(event.currentTarget)} onError={() => setFailed(true)} /> :
          <div className="admin-image-placeholder">{hasError ? <ImageOff size={26} aria-hidden="true" /> : <ImagePlus size={26} aria-hidden="true" />}<span>{hasError ? copy.error : copy.empty}</span></div>}
      </div>
      {!compact && <div className="admin-image-preview__details">
        <div className="admin-image-dimensions"><span>{copy.current}</span><strong>{dimensions && !hasError ? `${dimensions.width} × ${dimensions.height} px · ${imageAspectRatio(dimensions.width, dimensions.height)}` : source && !hasError ? copy.loading : "—"}</strong></div>
        {dimensions && !hasError && <>
          <p className={`admin-image-quality${small ? " is-warning" : ""}`}>{small ? <TriangleAlert size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}{small ? copy.small : copy.good}</p>
          {letterboxed && <p className="admin-media-hint">{copy.letterbox}</p>}
        </>}
        {source && <a href={source} target="_blank" rel="noreferrer" className="admin-image-original">{copy.original}<ArrowUpRight size={13} aria-hidden="true" /></a>}
      </div>}
    </div>
  );
}

export function ImageSizeGuide({ usage }: { usage: ImageUsage }) {
  const copy = mediaCopy[useResolvedLocale()];
  const guide = imageGuides[usage];
  return <div className="admin-image-guide"><span>{copy.recommended}</span>
    <strong>{guide.recommendedHeight ? `${guide.recommendedWidth} × ${guide.recommendedHeight} px` : `${guide.recommendedWidth} ${copy.wide}`}{usage === "cover" ? " · 16:10" : usage === "portrait" ? " · 3:4" : ""}</strong>
    <p>{usage === "cover" ? copy.coverGuide : usage === "portrait" ? copy.portraitGuide : copy.galleryGuide}</p>
  </div>;
}
