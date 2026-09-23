"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageOff, LoaderCircle, Maximize2, Minimize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useResolvedLocale } from "@/components/locale-provider";
import { Reveal } from "@/components/portfolio-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { designCopy } from "@/lib/design-copy";
import { safeImageSrc } from "@/lib/media";

type ProjectGalleryProps = {
  images: string[];
  title: string;
};

function GallerySlide({ src, alt, zoomed }: { src: string; alt: string; zoomed: boolean }) {
  const copy = designCopy[useResolvedLocale()];
  const imageRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete) setStatus(image.naturalWidth > 0 ? "ready" : "error");
  }, []);

  return (
    <div className={`gallery-viewer__stage${zoomed ? " is-original-size" : ""}`}>
      {status !== "error" && (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          draggable={false}
          className={status === "loading" ? "is-loading" : undefined}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
        />
      )}
      {status !== "ready" && (
        <div className="gallery-viewer__message" role="status">
          {status === "loading" ? (
            <LoaderCircle className="gallery-viewer__spinner" size={26} aria-hidden="true" />
          ) : <ImageOff size={28} aria-hidden="true" />}
          <p>{status === "loading" ? copy.galleryLoading : copy.galleryError}</p>
        </div>
      )}
    </div>
  );
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const copy = designCopy[useResolvedLocale()];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const index = Math.min(selectedIndex, images.length - 1);
  const hasMultiple = images.length > 1;

  if (!images.length) return null;

  const originalHref = safeImageSrc(images[index]);

  function changeImage(direction: -1 | 1) {
    setSelectedIndex((index + direction + images.length) % images.length);
    setZoomed(false);
  }

  return (
    <Dialog.Root onOpenChange={(open) => { if (!open) setZoomed(false); }}>
      <section className="case-gallery" aria-labelledby="gallery-title">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">{copy.gallery}</span>
            <h2 id="gallery-title">{title}</h2>
          </div>
          <p>{copy.galleryHint}</p>
        </div>
        <div className="case-gallery__grid">
          {images.map((image, imageIndex) => (
            <Reveal key={`${image}-${imageIndex}`}>
              <figure>
                <Dialog.Trigger
                  className="gallery-thumbnail"
                  aria-label={`${copy.galleryEnlarge}: ${title}, ${copy.galleryImage} ${imageIndex + 1}`}
                  onClick={() => { setSelectedIndex(imageIndex); setZoomed(false); }}
                >
                  <img src={image} alt={`${title}: ${copy.gallery} ${imageIndex + 1}`} loading="lazy" />
                  <span className="gallery-thumbnail__action" aria-hidden="true">
                    <Maximize2 size={16} />{copy.galleryEnlarge}
                  </span>
                </Dialog.Trigger>
                <figcaption>{String(imageIndex + 1).padStart(2, "0")} / {title}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <Dialog.Portal>
        <Dialog.Backdrop className="gallery-viewer__backdrop" />
        <Dialog.Popup
          className="gallery-viewer"
          initialFocus={closeRef}
          onKeyDown={(event) => {
            if (!hasMultiple || event.altKey || event.ctrlKey || event.metaKey) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              changeImage(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          <header className="gallery-viewer__header">
            <div>
              <span>{copy.gallery}</span>
              <Dialog.Title>{title}</Dialog.Title>
            </div>
            <Dialog.Close render={<Button ref={closeRef} type="button" variant="ghost" size="icon" aria-label={copy.galleryClose} />}>
              <X size={22} aria-hidden="true" />
            </Dialog.Close>
          </header>
          <Dialog.Description className="gallery-viewer__sr-only">
            {hasMultiple ? copy.galleryKeyboardHelp : copy.galleryCloseHelp}
          </Dialog.Description>

          {/* A new slide resets loading state and any original-size scroll position. */}
          <GallerySlide
            key={`${images[index]}-${index}`}
            src={images[index]}
            alt={`${title}: ${copy.galleryImage} ${index + 1}`}
            zoomed={zoomed}
          />

          <footer className="gallery-viewer__footer">
            <div className="gallery-viewer__navigation" role="group" aria-label={copy.gallery}>
              {hasMultiple && (
                <Button type="button" variant="outline" size="icon" aria-label={copy.galleryPrevious} onClick={() => changeImage(-1)}>
                  <ChevronLeft size={22} aria-hidden="true" />
                </Button>
              )}
              <p className="gallery-viewer__counter" aria-live="polite" aria-atomic="true">
                <span className="gallery-viewer__sr-only">{copy.galleryImage} </span>
                {index + 1}<span aria-hidden="true"> / </span>
                <span className="gallery-viewer__sr-only"> {copy.galleryOf} </span>{images.length}
              </p>
              {hasMultiple && (
                <Button type="button" variant="outline" size="icon" aria-label={copy.galleryNext} onClick={() => changeImage(1)}>
                  <ChevronRight size={22} aria-hidden="true" />
                </Button>
              )}
            </div>
            <p className="gallery-viewer__hint">
              {zoomed ? copy.galleryScrollHelp : hasMultiple ? copy.galleryKeyboardHelp : copy.galleryCloseHelp}
            </p>
            <div className="gallery-viewer__tools">
              <Button type="button" variant="outline" size="sm" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>
                {zoomed ? <Minimize2 size={17} aria-hidden="true" /> : <Maximize2 size={17} aria-hidden="true" />}
                {zoomed ? copy.galleryFit : copy.galleryOriginalSize}
              </Button>
              {originalHref && (
                <a href={originalHref} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "icon" })}
                  aria-label={copy.galleryOpenOriginal} title={copy.galleryOpenOriginal}>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </a>
              )}
            </div>
          </footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
