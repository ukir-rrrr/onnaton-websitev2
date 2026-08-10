import { siteConfig } from "@/lib/content/store";

export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center gap-3 border-t border-cream/10 px-6 py-10 text-center sm:flex-row sm:justify-between sm:px-10 sm:py-14 sm:text-left lg:px-14">
      <span className="font-serif-jp text-xl tracking-[0.08em] text-cream">
        {siteConfig.name}
      </span>
      <span className="text-[13px] text-cream/40">
        © {siteConfig.name} All Rights Reserved.
      </span>
    </footer>
  );
}
