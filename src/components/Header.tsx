import { useState } from "react";
import { Menu } from "lucide-react";
import logo from "../logo.png";

type HeaderProps = {
  onStart: () => void;
};

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
}

export function Header({ onStart }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function runMobileNavigationAction(action: () => void) {
    setIsMenuOpen(false);
    action();
  }

  function toggleMenu() {
    setIsMenuOpen((wasMenuOpen) => !wasMenuOpen);
  }

  return (
    <header className="site-header relative z-20 flex items-center justify-between border-b border-[#e6ebf1] bg-white">
      <button
        className="brand inline-flex items-center gap-[9px] border-0 bg-transparent font-display font-extrabold text-navy"
        onClick={() => runMobileNavigationAction(onStart)}
      >
        <img src={logo} alt="" />
        <span>Can I Buy It?</span>
      </button>
      <nav className="hidden gap-8 lg:flex">
        <button className="border-0 bg-transparent font-semibold text-[#4c5b6c]" onClick={onStart}>Calculator</button>
        <button className="border-0 bg-transparent font-semibold text-[#4c5b6c]" onClick={() => scrollToSection("how")}>How it works</button>
        <button className="border-0 bg-transparent font-semibold text-[#4c5b6c]" onClick={() => scrollToSection("about")}>About us</button>
      </nav>
      <button
        className="menu min-h-11 min-w-11 border-0 bg-transparent p-[10px] lg:hidden"
        aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        onClick={toggleMenu}
      >
        <Menu size={22} />
      </button>
      <div
        className={`mobile-nav ${isMenuOpen ? "open" : ""}`}
        id="mobile-navigation"
      >
        <button onClick={() => runMobileNavigationAction(onStart)}>
          Calculator
        </button>
        <button
          onClick={() =>
            runMobileNavigationAction(() => scrollToSection("how"))
          }
        >
          How it works
        </button>
        <button
          onClick={() =>
            runMobileNavigationAction(() => scrollToSection("about"))
          }
        >
          About us
        </button>
      </div>
    </header>
  );
}
