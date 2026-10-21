"use client";
import { useState } from "react";
import { useEditor } from "@/lib/store";
import { SitePage } from "./Render";

/** Public site route: same renderer as the editor canvas, in public mode (no editor chrome). */
export default function PublicPage({ pageId, lang }: { pageId: string; lang: "en" | "id" }) {
  const { data } = useEditor();
  const [open, setOpen] = useState(false);
  const page = data.pages.find((p) => p.id === pageId);
  if (!page) return <p style={{ padding: 40 }}>This page was removed in the current demo session.</p>;
  return <SitePage page={page} data={data} lang={lang} mode="public" menu={{ open, toggle: setOpen }} />;
}
