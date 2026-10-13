"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const links = [
  { href: "#cozumler", label: "Çözümler" },
  { href: "#nasil-calisir", label: "Nasıl çalışır?" },
  { href: "#faydalar", label: "Faydalar" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setOpen(false);
  return (
    <header
      className="sticky top-0 z-50 border-b border-[#102a2c]/8 bg-[#f7f8f4]/88 backdrop-blur-xl"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <a
          href="#ana-icerik"
          className="group flex items-center gap-2.5"
          onClick={closeMenu}
          aria-label="FlowPilot ana sayfa"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-[#0d6d62] text-[#dcefa3] shadow-[0_6px_16px_rgba(13,109,98,.22)]">
            <Icon name="spark" className="size-5" />
          </span>
          <span className="text-lg font-extrabold tracking-[-.055em] text-[#102a2c]">
            flowpilot
          </span>
        </a>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Ana menü"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#526968] transition hover:text-[#0d6d62]"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href="#talep"
            className="rounded-full bg-[#0d6d62] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-px hover:bg-[#095b52]"
          >
            Görüşme talep edin
          </a>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
        <button
          ref={toggleRef}
          type="button"
          className="grid size-11 place-items-center rounded-xl text-[#102a2c] md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobil-menu"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        >
          <Icon name={open ? "close" : "menu"} className="size-6" />
        </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobil-menu"
          className="border-t border-[#102a2c]/8 bg-[#f7f8f4] px-5 pb-5 pt-3 md:hidden"
          aria-label="Mobil menü"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="block rounded-lg px-3 py-3 text-sm font-bold text-[#3d5453] hover:bg-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#talep"
            onClick={closeMenu}
            className="mt-2 block rounded-xl bg-[#0d6d62] px-4 py-3 text-center text-sm font-bold text-white"
          >
            Görüşme talep edin
          </a>
        </nav>
      )}
    </header>
  );
}
