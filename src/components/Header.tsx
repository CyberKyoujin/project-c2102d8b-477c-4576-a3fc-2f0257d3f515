import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Heart } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl md:text-2xl font-bold text-foreground">
              Сестра<span className="text-primary">24</span>
            </span>
          </Link>

          {/* Desktop Navigation - hidden on tablet and mobile */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Головна
            </Link>
            <Link to="/order" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Викликати медсестру
            </Link>
            <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Профіль
            </Link>
          </nav>

          {/* Right side: CTA buttons + hamburger grouped together */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA - phone hidden on tablet, buttons hidden on mobile */}
            <div className="hidden sm:flex items-center gap-3">
              <a href="tel:+380800123456" className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-medium">0 800 123 456</span>
              </a>
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Увійти
                </Button>
              </Link>
              <Link to="/order">
                <Button variant="hero" size="sm">
                  Замовити
                </Button>
              </Link>
            </div>

            {/* Hamburger Menu Button - visible on tablet (for nav/phone) and mobile (for everything) */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Головна
              </Link>
              <Link
                to="/order"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Викликати медсестру
              </Link>
              <Link
                to="/profile"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Профіль
              </Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <a href="tel:+380800123456" className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span className="font-medium">0 800 123 456</span>
                </a>
                {/* Auth buttons only in mobile menu (hidden on tablet since they're visible in header) */}
                <div className="sm:hidden flex flex-col gap-3">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Увійти
                    </Button>
                  </Link>
                  <Link to="/order" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="hero" className="w-full">
                      Замовити виклик
                    </Button>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
