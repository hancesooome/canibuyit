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
    <header className="site-header">
      <button
        className="brand"
        onClick={() => runMobileNavigationAction(onStart)}
      >
        <img src={logo} alt="" />
        <span>Can I Buy It?</span>
      </button>
      <nav>
        <button onClick={onStart}>Calculator</button>
        <button onClick={() => scrollToSection("how")}>How it works</button>
        <button onClick={() => scrollToSection("about")}>About us</button>
      </nav>
      <button
        className="menu"
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
