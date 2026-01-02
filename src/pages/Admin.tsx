import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Clock, CheckCircle, Loader2, AlertTriangle,
  MapPin, Phone, User, Calendar, Filter
} from "lucide-react";

// Mock data
const mockOrders = [
  {
    id: "1",
    patient: "Іван Петренко",
    phone: "+380 67 123 4567",
    services: ["Ін'єкції", "Вимірювання показників"],
    address: "м. Тернопіль, вул. Шевченка, 10",
    date: "2026-01-03",
    time: "14:00",
    status: "pending",
    price: 250,
  },
  {
    id: "2",
    patient: "Марія Ковальчук",
    phone: "+380 50 987 6543",
    services: ["Крапельниці"],
    address: "м. Тернопіль, вул. Грушевського, 5",
    date: "2026-01-03",
    time: "10:00",
    status: "confirmed",
    nurse: "Оксана К.",
    price: 350,
  },
  {
    id: "3",
    patient: "Олег Сидоренко",
    phone: "+380 63 555 1234",
    services: ["Перев'язки", "Догляд"],
    address: "смт Збараж, вул. Центральна, 15",
    date: "2026-01-03",
    time: "16:30",
    status: "in_progress",
    nurse: "Марія І.",
    price: 700,
  },
  {
    id: "4",
    patient: "Анна Бондаренко",
    phone: "+380 97 222 3344",
    services: ["Ін'єкції"],
    address: "м. Тернопіль, вул. Руська, 22",
    date: "2026-01-02",
    time: "09:00",
    status: "completed",
    nurse: "Оксана К.",
    price: 150,
  },
];

const statusConfig = {
  pending: {
    label: "Очікує",
    icon: Clock,
    color: "text-warning bg-warning/10 border-warning/30",
  },
  confirmed: {
    label: "Підтверджено",
    icon: CheckCircle,
    color: "text-primary bg-primary/10 border-primary/30",
  },
  in_progress: {
    label: "Виконується",
    icon: Loader2,
    color: "text-secondary bg-secondary/10 border-secondary/30",
  },
  completed: {
    label: "Завершено",
    icon: CheckCircle,
    color: "text-success bg-success/10 border-success/30",
  },
};

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: mockOrders.filter((o) => o.status === "pending").length,
    confirmed: mockOrders.filter((o) => o.status === "confirmed").length,
    in_progress: mockOrders.filter((o) => o.status === "in_progress").length,
    completed: mockOrders.filter((o) => o.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Панель адміністратора
            </h1>
            <p className="text-muted-foreground">
              Моніторинг та управління замовленнями
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(statusConfig).map(([key, config]) => {
              const count = stats[key as keyof typeof stats];
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setStatusFilter(statusFilter === key ? null : key)}
                  className={`bg-card rounded-xl p-4 shadow-soft text-left transition-all hover:shadow-card ${
                    statusFilter === key ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{count}</p>
                      <p className="text-sm text-muted-foreground">{config.label}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Пошук за ім'ям, адресою або телефоном..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {statusFilter && (
              <Button variant="outline" onClick={() => setStatusFilter(null)}>
                <Filter className="w-4 h-4" />
                Скинути фільтр
              </Button>
            )}
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Пацієнт</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Послуги</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Адреса</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Дата/Час</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Статус</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Дії</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((order) => {
                    const status = statusConfig[order.status as keyof typeof statusConfig];
                    const StatusIcon = status.icon;

                    return (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{order.patient}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {order.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-foreground">{order.services.join(", ")}</p>
                          <p className="text-sm font-medium text-primary">{order.price} ₴</p>
                        </td>
                        <td className="p-4">
                          <p className="text-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            {order.address}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(order.date).toLocaleDateString("uk-UA", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">{order.time}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}
                          >
                            <StatusIcon className="w-4 h-4" />
                            {status.label}
                          </span>
                          {order.nurse && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {order.nurse}
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {order.status === "pending" && (
                              <Button size="sm" variant="default">
                                Підтвердити
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              Деталі
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Замовлень не знайдено</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
