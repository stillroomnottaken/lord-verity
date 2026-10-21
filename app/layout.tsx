import type { Metadata, Viewport } from "next";
import { EditorProvider } from "@/lib/store";
import "./site.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "PT Berkat Muri Sejahtera (BMS)",
  description: "Agricultural commodities, bio-based and industrial materials. Indonesian trading company based in Jakarta.",
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#90C207" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="js">
      <body>
        {/* EditorProvider lives in memory only. It sits above the routes so client-side navigation between
            /admin and the public pages shows the same in-session edits. A refresh resets it. */}
        <EditorProvider>{children}</EditorProvider>
      </body>
    </html>
  );
}
