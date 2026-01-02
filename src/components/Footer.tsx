import { Link } from "react-router-dom";
import { Heart, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-2xl font-bold">
                Сестра24
              </span>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm">
              Професійні медсестринські послуги вдома. Працюємо цілодобово у Тернопільській області.
            </p>
            <div className="space-y-2">
              <a href="tel:+380800123456" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors">
                <Phone className="w-4 h-4" />
                0 800 123 456 (безкоштовно)
              </a>
              <a href="mailto:info@sestra24.ua" className="flex items-center gap-2 text-background/70 hover:text-background transition-colors">
                <Mail className="w-4 h-4" />
                info@sestra24.ua
              </a>
              <p className="flex items-center gap-2 text-background/70">
                <MapPin className="w-4 h-4" />
                Тернопільська область
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Послуги</h4>
            <ul className="space-y-2">
              <li><Link to="/order" className="text-background/70 hover:text-background transition-colors">Ін'єкції</Link></li>
              <li><Link to="/order" className="text-background/70 hover:text-background transition-colors">Крапельниці</Link></li>
              <li><Link to="/order" className="text-background/70 hover:text-background transition-colors">Перев'язки</Link></li>
              <li><Link to="/order" className="text-background/70 hover:text-background transition-colors">Догляд за хворими</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Кабінет</h4>
            <ul className="space-y-2">
              <li><Link to="/auth" className="text-background/70 hover:text-background transition-colors">Увійти</Link></li>
              <li><Link to="/order" className="text-background/70 hover:text-background transition-colors">Замовити виклик</Link></li>
              <li><Link to="/orders" className="text-background/70 hover:text-background transition-colors">Мої замовлення</Link></li>
              <li><Link to="/medical-card" className="text-background/70 hover:text-background transition-colors">Медкарта</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © 2026 Сестра24. Всі права захищені.
          </p>
          <div className="flex gap-6">
            <Link to="/" className="text-background/60 hover:text-background text-sm transition-colors">
              Політика конфіденційності
            </Link>
            <Link to="/" className="text-background/60 hover:text-background text-sm transition-colors">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
