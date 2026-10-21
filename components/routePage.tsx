import type { Metadata } from "next";
import { PAGES } from "@/lib/seed";
import type { Lang } from "@/lib/model";
import PublicPage from "./PublicPage";

/** Helpers so each public route is a tiny, plainly named file (no special characters in folder names). */
export const meta = (pageId: string, lang: Lang): Metadata => {
  const p = PAGES.find((x) => x.id === pageId)!;
  return { title: `${p.name[lang]} | PT Berkat Muri Sejahtera (BMS)` };
};
export const makePage = (pageId: string, lang: Lang) =>
  function Page() { return <PublicPage pageId={pageId} lang={lang} />; };
