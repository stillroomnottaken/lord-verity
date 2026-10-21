"use client";
import { useRef } from "react";
import { useEditor } from "@/lib/store";
import { I } from "../icons";
import { Modal } from "./controls";

export function MediaGrid({ onPick, selectedSrc }: { onPick?: (src: string) => void; selectedSrc?: string }) {
  const ed = useEditor();
  const file = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="ed-media-actions">
        <button className="ed-btn" onClick={() => file.current?.click()}>{I.upload} Choose local image…</button>
        <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) { const it = ed.addMedia(f); ed.toast("Local preview added (this session only)"); onPick?.(it.src); } e.target.value = ""; }} />
        <small className="ed-hint">Local files are previewed through a temporary browser URL. Nothing is uploaded or stored.</small>
      </div>
      <div className="ed-media-grid">
        {ed.media.map((m) => (
          <figure key={m.id} className={m.src === selectedSrc ? "is-sel" : ""}>
            <button onClick={() => onPick?.(m.src)} disabled={!onPick} title={onPick ? "Use this image" : m.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt={m.name} draggable={false} />
            </button>
            <figcaption><span>{m.name}</span><em>{m.origin}</em>{m.origin === "upload" && <button className="ed-x" onClick={() => ed.removeMedia(m.id)} title="Remove from library">{I.x}</button>}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
export function MediaPicker({ onPick, onClose, current }: { onPick: (src: string) => void; onClose: () => void; current?: string }) {
  return <Modal title="Media library" onClose={onClose} wide><MediaGrid selectedSrc={current} onPick={(s) => { onPick(s); onClose(); }} /></Modal>;
}
