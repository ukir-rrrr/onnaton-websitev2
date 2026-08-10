"use client";

import { Fragment, useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/content/nav";
import { siteConfig } from "@/lib/content/store";
import { LanguageFlags } from "@/components/layout/LanguageFlags";

/** Home-page section id → matching nav href */
const SECTION_TO_NAV: { id: string; href: string }[] = [
  { id: "top", href: "/" },
  { id: "about-text", href: "/#about-text" },
  { id: "kodawari", href: "/#kodawari" },
  { id: "course", href: "/course" },
  { id: "interior", href: "/seats" },
  { id: "access", href: "/#access" },
];

function navClass(active: boolean) {
  return active
    ? "font-serif-jp rounded px-3.5 py-1.5 text-[13.5px] tracking-[0.06em] text-gold bg-cream/8"
    : "font-serif-jp rounded px-3.5 py-1.5 text-[13.5px] tracking-[0.06em] text-cream hover:bg-cream/6 hover:text-gold";
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeHref, setActiveHref] = useState("/");
  const pathname = usePathname();

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      setScrolled(y > 24);

      // At top: always show. Menu open: always show.
      // Scroll down: hide. Scroll up: show.
      if (menuOpen || y < 48) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      lastY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Route pages: highlight by path. Home: scroll-spy sections.
  useEffect(() => {
    if (pathname === "/course") {
      setActiveHref("/course");
      return;
    }
    if (pathname === "/seats") {
      setActiveHref("/seats");
      return;
    }
    if (pathname !== "/") {
      setActiveHref("/");
      return;
    }

    const visibles = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visibles.set(id, entry.intersectionRatio);
          } else {
            visibles.delete(id);
          }
        }

        // Prefer the section highest on the page among those in view
        let best: { id: string; top: number } | null = null;
        for (const { id } of SECTION_TO_NAV) {
          if (!visibles.has(id)) continue;
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (!best || Math.abs(top - 96) < Math.abs(best.top - 96)) {
            best = { id, top };
          }
        }

        if (best) {
          const match = SECTION_TO_NAV.find((s) => s.id === best!.id);
          if (match) setActiveHref(match.href);
        } else if (window.scrollY < 80) {
          setActiveHref("/");
        }
      },
      {
        // Account for fixed header; favor content in the upper mid viewport
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    for (const { id } of SECTION_TO_NAV) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
    setActiveHref("/");
  };

  const onNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    // Same-page "/" does not scroll in the App Router — force top.
    if (href === "/" && pathname === "/") {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter,border-color] duration-300 ease-out ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled || menuOpen
          ? "border-b border-cream/10 bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent bg-black/50 backdrop-blur-[1px]"
      }`}
    >
      <div className="flex h-20 items-stretch justify-between">
        <Link
          href="/"
          onClick={(event) => {
            if (pathname === "/") {
              event.preventDefault();
              scrollToTop();
            } else {
              setMenuOpen(false);
            }
          }}
          className="flex flex-col justify-center gap-0.5 pl-5 sm:flex-row sm:items-center sm:gap-3 sm:pl-10"
          aria-label={`${siteConfig.name} ${siteConfig.nameRomaji}`}
        >
          <span className="font-serif-jp text-[20px] font-bold leading-none tracking-[0.06em] text-cream sm:text-2xl">
            {siteConfig.name}
          </span>
          <span className="font-sans-jp text-[10px] font-medium leading-none tracking-[0.28em] text-cream/70 sm:text-[11px]">
            {siteConfig.nameRomaji}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 pr-5 lg:flex lg:pr-8">
          <div className="flex items-center">
            {navLinks.map((link, i) => (
              <Fragment key={link.href}>
                {i > 0 && (
                  <span
                    aria-hidden
                    className="mx-1 h-4 border-l border-dotted border-cream/35"
                  />
                )}
                <Link
                  href={link.href}
                  onClick={(event) => onNavClick(event, link.href)}
                  aria-current={activeHref === link.href ? "page" : undefined}
                  className={navClass(activeHref === link.href)}
                >
                  {link.label}
                </Link>
              </Fragment>
            ))}
          </div>

          <LanguageFlags />

          <a
            href="/#reserve"
            className="my-3.5 flex items-center rounded-sm bg-gold px-7 font-bold tracking-[0.05em] text-ink hover:bg-cream"
          >
            予約・お問い合わせ
          </a>
        </nav>

        <div className="flex items-center lg:hidden">
          <LanguageFlags className="pr-3" />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
            className="flex min-h-11 w-14 flex-col items-center justify-center gap-1.5 self-stretch border-l border-cream/20 sm:w-16"
          >
            <span
              className={`h-px w-5 bg-cream transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`h-px w-5 bg-cream transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`h-px w-5 bg-cream transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-cream/10 bg-ink/95 px-6 py-5 lg:hidden">
          <nav className="flex flex-col text-[16px]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => onNavClick(event, link.href)}
                aria-current={activeHref === link.href ? "page" : undefined}
                className={
                  activeHref === link.href
                    ? "flex min-h-11 items-center text-gold"
                    : "flex min-h-11 items-center text-cream/85 hover:text-cream"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href="/#reserve"
            onClick={() => setMenuOpen(false)}
            className="mt-5 flex min-h-12 items-center justify-center bg-gold text-[15px] font-bold tracking-[0.05em] text-ink"
          >
            予約・お問い合わせ
          </a>
        </div>
      )}
    </header>
  );
}
