import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Syringe, Droplets, Bandage, Heart, Baby, Pill, 
  MapPin, Calendar, Clock, CheckCircle 
} from "lucide-react";

const services = [
  { id: "injection", icon: Syringe, title: "Ін'єкції", price: 150 },
  { id: "drip", icon: Droplets, title: "Крапельниці", price: 300 },
  { id: "bandage", icon: Bandage, title: "Перев'язки", price: 200 },
  { id: "vitals", icon: Heart, title: "Вимірювання показників", price: 100 },
  { id: "care", icon: Baby, title: "Догляд за хворими", price: 500 },
  { id: "meds", icon: Pill, title: "Контроль ліків", price: 200 },
];

const Order = () => {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    date: "",
    time: "",
    notes: "",
  });

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = services.find((s) => s.id === id);
    return sum + (service?.price || 0);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit order to backend
    setStep(3);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s
                      ? "gradient-hero text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 rounded ${step > s ? "gradient-hero" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Services */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2 text-center">
                Оберіть послуги
              </h1>
              <p className="text-muted-foreground text-center mb-8">
                Виберіть одну або кілька послуг, які вам потрібні
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      selectedServices.includes(service.id)
                        ? "border-primary bg-primary/5 shadow-card"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          selectedServices.includes(service.id)
                            ? "gradient-hero"
                            : "bg-muted"
                        }`}
                      >
                        <service.icon
                          className={`w-6 h-6 ${
                            selectedServices.includes(service.id)
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{service.title}</h3>
                        <p className="text-primary font-medium">від {service.price} ₴</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedServices.length > 0 && (
                <div className="bg-muted/50 rounded-xl p-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Орієнтовна вартість:</span>
                    <span className="text-2xl font-bold text-foreground">від {totalPrice} ₴</span>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  variant="hero"
                  size="xl"
                  disabled={selectedServices.length === 0}
                  onClick={() => setStep(2)}
                >
                  Продовжити
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Address & Time */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2 text-center">
                Адреса та час
              </h1>
              <p className="text-muted-foreground text-center mb-8">
                Вкажіть, куди та коли приїхати медсестрі
              </p>

              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">Населений пункт</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="city"
                        placeholder="Тернопіль"
                        className="pl-10 h-12"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Адреса</Label>
                    <Input
                      id="address"
                      placeholder="вул. Шевченка, 10, кв. 5"
                      className="h-12"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Бажана дата</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-10 h-12"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Бажаний час</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        className="pl-10 h-12"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Додаткова інформація (необов'язково)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Опишіть симптоми, особливі потреби або як вас знайти..."
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                  Назад
                </Button>
                <Button type="submit" variant="hero" size="lg">
                  Замовити виклик
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center animate-fade-in">
              <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-12 h-12 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                Замовлення створено!
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Ми зв'яжемось з вами протягом 15 хвилин для підтвердження деталей виклику.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/orders">
                  <Button variant="hero" size="lg">
                    Мої замовлення
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="lg">
                    На головну
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Order;
