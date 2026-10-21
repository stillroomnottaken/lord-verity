"use client";
import Link from "next/link";
import { useState } from "react";
import { resolveHref, type Lang } from "@/lib/model";
import { useEditor, type Device, type View } from "@/lib/store";
import { I } from "../icons";
import { SitePage } from "../Render";
import { Modal } from "./controls";
import { DEVICE_W, EditorView } from "./EditorView";
import { CatalogueManager, DesignSettings, Languages, MediaLibrary, Overview, Pages } from "./Views";

const NAV_ITEMS: [View, string, keyof typeof I][] = [
  ["overview", "Overview", "home"], ["editor", "Website Editor", "edit"], ["pages", "Pages", "pages"], ["catalogue", "Catalogue", "box"],
  ["media", "Media Library", "image"], ["languages", "Languages", "globe"], ["design", "Design Settings", "palette"],
];

function Preview({ onClose }: { onClose: () => void }) {
  const ed = useEditor();
  const [menu, setMenu] = useState(false);
  const { ui } = ed;
  const page = ed.page;
  // Simulated navigation: internal links switch the previewed page instead of leaving /admin.
  const intercept = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest("a"); if (!a) return;
    const href = a.getAttribute("href") ?? "";
    if (!href.startsWith("/")) return;
    e.preventDefault();
    const path = href.split("?")[0];
    for (const p of ed.data.pages) for (const l of ["en", "id"] as Lang[]) if (resolveHref(`@${p.id}`, ed.data, l) === path) { ed.patchUi({ pageId: p.id, lang: l }); setMenu(false); return; }
  };
  return (
    <div className="ed-preview" role="dialog" aria-label="Preview">
      <div className="ed-pv-bar">
        <button className="ed-btn sm primary" onClick={onClose}>{I.back} Back to editor</button>
        <span className="ed-pv-note"><b>Preview</b> · simulated public site, showing this session's edits only. Not published.</span>
        <div className="ed-grow" />
        <div className="ed-seg" role="group" aria-label="Preview size">{(["desktop", "tablet", "mobile"] as Device[]).map((d) => <button key={d} aria-pressed={ui.device === d} onClick={() => ed.patchUi({ device: d })} title={d}>{I[d]}</button>)}</div>
        <div className="ed-seg" role="group" aria-label="Language">{(["en", "id"] as const).map((l) => <button key={l} aria-pressed={ui.lang === l} onClick={() => ed.patchUi({ lang: l })}>{l.toUpperCase()}</button>)}</div>
      </div>
      <div className="ed-pv-stage">
        <div className="ed-pv-frame" style={{ width: Math.min(DEVICE_W[ui.device], 1600), maxWidth: "100%" }} onClickCapture={intercept}>
          <SitePage page={page} data={ed.data} lang={ui.lang} mode="public" menu={{ open: menu, toggle: setMenu }} />
        </div>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const ed = useEditor();
  const { ui } = ed;
  const [confirm, setConfirm] = useState(false);
  const view = ui.view;
  return (
    <div className="ed-app">
      <nav className="ed-side" aria-label="Admin navigation">
        <div className="ed-brand"><span className="ed-mark">BMS</span><span className="ed-brand-t"><b>Visual Editor</b><small>Interactive demo</small></span></div>
        <ul>{NAV_ITEMS.map(([id, label, icon]) => (
          <li key={id}><button className={view === id ? "is-active" : ""} aria-current={view === id ? "page" : undefined} onClick={() => ed.patchUi({ view: id })} title={label}>{I[icon]}<span>{label}</span></button></li>
        ))}</ul>
        <div className="ed-side-foot">
          <div className="ed-langchip" title="Current editing language"><span>Editing</span><b>{ui.lang === "en" ? "English" : "Indonesian"}</b></div>
          <Link className="ed-btn sm" href={ui.lang === "en" ? "/" : "/id"}>{I.back}<span>Public website</span></Link>
        </div>
      </nav>
      <div className="ed-main">
        <div className="ed-banner" role="status"><b>Demo mode</b><span> — changes exist only in this session. Nothing is saved or published; refreshing restores the original content. Not a secured CMS.</span></div>
        <div className="ed-body">
          {view === "overview" && <Overview />}
          {view === "editor" && <EditorView onReset={() => setConfirm(true)} onPreview={() => ed.patchUi({ preview: true })} />}
          {view === "pages" && <Pages onPreview={() => ed.patchUi({ preview: true })} />}
          {view === "catalogue" && <CatalogueManager />}
          {view === "media" && <MediaLibrary />}
          {view === "languages" && <Languages />}
          {view === "design" && <DesignSettings />}
        </div>
      </div>
      {ui.preview && <Preview onClose={() => ed.patchUi({ preview: false })} />}
      {view !== "editor" && <button className="ed-fab" onClick={() => setConfirm(true)}>{I.reset} Reset demo</button>}
      {confirm && (
        <Modal title="Reset demo?" onClose={() => setConfirm(false)}>
          <p>This restores all original BMS pages, catalogue entries, translations and design settings, and clears undo/redo history. Local image previews are discarded.</p>
          <div className="ed-modal-actions"><button className="ed-btn" onClick={() => setConfirm(false)}>Cancel</button><button className="ed-btn danger" onClick={() => { ed.reset(); setConfirm(false); }}>Reset everything</button></div>
        </Modal>
      )}
      <div className={`ed-toast${ui.toast ? " show" : ""}`} role="status" aria-live="polite">{ui.toast}</div>
    </div>
  );
}
