import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, AlertTriangle, Pill, Phone, User, Save, 
  Plus, X, Droplets 
} from "lucide-react";

const MedicalCard = () => {
  // Placeholder data for UI display
  const allergies = ["Пеніцилін"];
  const medications = ["Аспірин 100мг"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                Медична карта
              </h1>
              <p className="text-muted-foreground">
                Інформація для швидкої та безпечної допомоги
              </p>
            </div>
            <Button variant="hero">
              <Save className="w-4 h-4" />
              Зберегти
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Основна інформація</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Група крові</Label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="bloodType"
                      placeholder="A+, B-, O+ тощо"
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chronicConditions">Хронічні захворювання</Label>
                  <Textarea
                    id="chronicConditions"
                    placeholder="Діабет, гіпертонія, астма..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Екстрений контакт</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Ім'я контакту</Label>
                  <Input
                    id="emergencyName"
                    placeholder="Ім'я та хто це (родич, друг)"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Номер телефону</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="emergencyContact"
                      type="tel"
                      placeholder="+380 XX XXX XX XX"
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Алергії</h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-warning/10 text-warning rounded-full text-sm font-medium"
                  >
                    {allergy}
                    <button
                      type="button"
                      className="hover:bg-warning/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Додати алергію..."
                  className="h-10"
                />
                <Button type="button" variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Medications */}
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Pill className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Поточні ліки</h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {medications.map((med) => (
                  <span
                    key={med}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                  >
                    {med}
                    <button
                      type="button"
                      className="hover:bg-secondary/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Додати ліки..."
                  className="h-10"
                />
                <Button type="button" variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="md:col-span-2 bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Додаткова інформація</h2>
              </div>

              <Textarea
                placeholder="Будь-яка важлива інформація для медичного персоналу: страхи, особливі потреби, попередні операції..."
                rows={4}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MedicalCard;
