import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Mail, Phone, MapPin, Calendar, Edit2, Save,
  Heart, AlertTriangle, Pill, Droplets, Plus, X,
  Clock, CheckCircle, Loader2, Syringe, Settings, LogOut
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "Очікує",
    icon: Clock,
    color: "text-warning bg-warning/10",
  },
  confirmed: {
    label: "Підтверджено",
    icon: CheckCircle,
    color: "text-primary bg-primary/10",
  },
  in_progress: {
    label: "Виконується",
    icon: Loader2,
    color: "text-secondary bg-secondary/10",
  },
  completed: {
    label: "Завершено",
    icon: CheckCircle,
    color: "text-success bg-success/10",
  },
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Placeholder data
  const allergies = ["Пеніцилін"];
  const medications = ["Аспірин 100мг"];
  const orders: Array<{
    id: string;
    date: string;
    time: string;
    services: string[];
    address: string;
    status: keyof typeof statusConfig;
    price: number;
  }> = [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Profile Header */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full gradient-hero flex items-center justify-center">
                <User className="w-10 h-10 md:w-12 md:h-12 text-primary-foreground" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-1">
                  Користувач
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  email@example.com
                </p>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4" />
                  +380 XX XXX XX XX
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                  Налаштування
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                  Вийти
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="bg-card shadow-soft p-1 h-auto">
              <TabsTrigger value="orders" className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Замовлення
              </TabsTrigger>
              <TabsTrigger value="medical" className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Heart className="w-4 h-4 mr-2" />
                Медкарта
              </TabsTrigger>
              <TabsTrigger value="personal" className="px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="w-4 h-4 mr-2" />
                Особисті дані
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Історія замовлень</h2>
                <Link to="/order">
                  <Button variant="hero" size="sm">
                    <Plus className="w-4 h-4" />
                    Новий виклик
                  </Button>
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-2xl shadow-soft">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                    <Syringe className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Замовлень поки немає
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Створіть перший виклик медсестри
                  </p>
                  <Link to="/order">
                    <Button variant="hero">
                      Викликати медсестру
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const status = statusConfig[order.status];
                    const StatusIcon = status.icon;

                    return (
                      <div
                        key={order.id}
                        className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                                <Droplets className="w-5 h-5 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {order.services.join(", ")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  #{order.id}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {order.date} о {order.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {order.address}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              {status.label}
                            </span>
                            <p className="text-xl font-bold text-foreground">
                              {order.price} ₴
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Medical Card Tab */}
            <TabsContent value="medical" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Медична карта</h2>
                <Button variant={isEditing ? "hero" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Зберегти
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Редагувати
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Основна інформація</h3>
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
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chronicConditions">Хронічні захворювання</Label>
                      <Textarea
                        id="chronicConditions"
                        placeholder="Діабет, гіпертонія, астма..."
                        rows={3}
                        disabled={!isEditing}
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
                    <h3 className="text-lg font-semibold text-foreground">Екстрений контакт</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Ім'я контакту</Label>
                      <Input
                        id="emergencyName"
                        placeholder="Ім'я та хто це (родич, друг)"
                        className="h-12"
                        disabled={!isEditing}
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
                          disabled={!isEditing}
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
                    <h3 className="text-lg font-semibold text-foreground">Алергії</h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-warning/10 text-warning rounded-full text-sm font-medium"
                      >
                        {allergy}
                        {isEditing && (
                          <button type="button" className="hover:bg-warning/20 rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Input placeholder="Додати алергію..." className="h-10" />
                      <Button type="button" variant="outline" size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Medications */}
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Поточні ліки</h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {medications.map((med) => (
                      <span
                        key={med}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                      >
                        {med}
                        {isEditing && (
                          <button type="button" className="hover:bg-secondary/20 rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Input placeholder="Додати ліки..." className="h-10" />
                      <Button type="button" variant="outline" size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="md:col-span-2 bg-card rounded-2xl p-6 shadow-soft">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Додаткова інформація</h3>
                  </div>

                  <Textarea
                    placeholder="Будь-яка важлива інформація для медичного персоналу..."
                    rows={4}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Personal Data Tab */}
            <TabsContent value="personal" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Особисті дані</h2>
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4" />
                  Редагувати
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-soft">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ім'я</Label>
                    <Input id="firstName" placeholder="Ваше ім'я" className="h-12" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Прізвище</Label>
                    <Input id="lastName" placeholder="Ваше прізвище" className="h-12" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="email@example.com" className="pl-10 h-12" disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="phone" type="tel" placeholder="+380 XX XXX XX XX" className="pl-10 h-12" disabled />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Адреса за замовчуванням</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="address" placeholder="Вулиця, будинок, квартира" className="pl-10 h-12" disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Дата народження</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="birthDate" type="date" className="pl-10 h-12" disabled />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
