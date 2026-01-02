import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Shield, MapPin, ArrowRight } from "lucide-react";
const Hero = () => {
  return <section className="relative min-h-[85vh] flex items-center pt-16 pb-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center my-px">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">
                Працюємо у Тернопільській області
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight text-balance">
              Професійна{" "}
              <span className="text-primary">медсестра</span>{" "}
              у вас вдома
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Ін'єкції, крапельниці, перев'язки та догляд за хворими. 
              Викличте кваліфіковану медсестру за 5 хвилин.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/order">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Викликати медсестру
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Увійти в кабінет
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">До 30 хвилин</p>
                  <p className="text-sm text-muted-foreground">Час прибуття</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Ліцензовані</p>
                  <p className="text-sm text-muted-foreground">Спеціалісти</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-soft" />
              <div className="absolute inset-8 rounded-full border-2 border-secondary/20 animate-pulse-soft" style={{
              animationDelay: "0.5s"
            }} />
              <div className="absolute inset-16 rounded-full border-2 border-primary/30 animate-pulse-soft" style={{
              animationDelay: "1s"
            }} />
              
              {/* Central icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 gradient-hero rounded-full flex items-center justify-center shadow-card animate-float">
                  <svg className="w-24 h-24 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute top-8 right-0 bg-card rounded-xl p-4 shadow-card animate-float" style={{
              animationDelay: "0.5s"
            }}>
                <p className="text-sm font-medium text-foreground">🩺 Ін'єкції</p>
              </div>
              <div className="absolute bottom-20 left-0 bg-card rounded-xl p-4 shadow-card animate-float" style={{
              animationDelay: "1s"
            }}>
                <p className="text-sm font-medium text-foreground">💉 Крапельниці</p>
              </div>
              <div className="absolute bottom-8 right-8 bg-card rounded-xl p-4 shadow-card animate-float" style={{
              animationDelay: "1.5s"
            }}>
                <p className="text-sm font-medium text-foreground">🩹 Перев'язки</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;