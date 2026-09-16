"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowUp, ArrowUpRight, Menu, X } from "lucide-react";
import { MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LanguageSelector } from "@/components/language-selector";
import { useResolvedLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { designCopy } from "@/lib/design-copy";
import { siteCopy } from "@/lib/i18n";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const locale = useResolvedLocale();
  const copy = siteCopy[locale];
  const design = designCopy[locale];
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = [
    { href: "/#featured", label: copy.navWork },
    { href: "/#expertise", label: design.expertise },
    { href: "/#about", label: design.about },
    { href: "/admin", label: copy.navAdmin }
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell portfolio-shell" id="top">
        <a href="#main-content" className="skip-link">{design.skipContent}</a>
        <header className="site-header portfolio-header">
          <a href="/" className="brand-mark">
            <img src="/icon-192.png" alt="" className="brand-mark__logo" width={38} height={38} aria-hidden="true" />
            <span>Lucas Monzón<span className="brand-period">.</span></span>
          </a>
          <nav className="desktop-navigation" aria-label={design.navigation}>
            {navigation.map((link) => <a key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</a>)}
          </nav>
          <div className="header-controls">
            <LanguageSelector />
            <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
              <Dialog.Trigger render={<Button variant="ghost" size="icon" className="mobile-menu-trigger" aria-label={design.openMenu} />}>
                <Menu size={21} aria-hidden="true" />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Backdrop className="nav-backdrop" />
                <Dialog.Popup className="mobile-navigation">
                  <div className="mobile-navigation__top"><Dialog.Title>{design.navigation}</Dialog.Title>
                    <Dialog.Close render={<Button variant="ghost" size="icon" aria-label={design.closeMenu} />}><X size={21} aria-hidden="true" /></Dialog.Close>
                  </div>
                  <nav aria-label={design.navigation}>{navigation.map((link, index) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                    <span>0{index + 1}</span>{link.label}<ArrowUpRight size={21} aria-hidden="true" />
                  </a>)}</nav>
                </Dialog.Popup>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>{children}</main>
        <footer className="site-footer portfolio-footer">
          <div className="footer-identity"><span>Lucas Monzón<span className="brand-period">.</span></span><p>{design.builtWith}</p></div>
          <div className="site-footer__links">
            <a href="https://github.com/Fake-Sun" target="_blank" rel="noreferrer">{copy.footerGithub}<ArrowUpRight size={14} aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/in/lucasmonzon2911/" target="_blank" rel="noreferrer">{copy.footerLinkedIn}<ArrowUpRight size={14} aria-hidden="true" /></a>
            <a href="mailto:contact@lucasmonzon.dev">Email<ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
          <a href="#top" className="back-to-top" aria-label={design.backTop} title={design.backTop}><ArrowUp size={19} aria-hidden="true" /></a>
        </footer>
      </div>
    </MotionConfig>
  );
}
