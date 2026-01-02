import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Clock, CheckCircle, Loader2, MapPin, Calendar,
  Syringe, Droplets, Plus
} from "lucide-react";

// Mock data for demonstration
const orders = [
  {
    id: "1",
    date: "2026-01-03",
    time: "14:00",
    services: ["Ін'єкції", "Вимірювання показників"],
    address: "м. Тернопіль, вул. Шевченка, 10",
    status: "pending",
    price: 250,
  },
  {
    id: "2",
    date: "2025-12-28",
    time: "10:00",
    services: ["Крапельниці"],
    address: "м. Тернопіль, вул. Грушевського, 5",
    status: "completed",
    price: 350,
    nurse: "Оксана Ковальчук",
  },
  {
    id: "3",
    date: "2025-12-20",
    time: "16:30",
    services: ["Перев'язки"],
    address: "м. Тернопіль, вул. Шевченка, 10",
    status: "completed",
    price: 200,
    nurse: "Марія Іванова",
  },
];

const statusConfig = {
  pending: {
    label: "Очікує підтвердження",
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

const Orders = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                Мої замовлення
              </h1>
              <p className="text-muted-foreground">
                Історія та статус ваших викликів
              </p>
            </div>
            <Link to="/order">
              <Button variant="hero">
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
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Замовлень поки немає
              </h2>
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
                const status = statusConfig[order.status as keyof typeof statusConfig];
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
                              Замовлення #{order.id}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.date).toLocaleDateString("uk-UA", {
                              day: "numeric",
                              month: "long",
                            })}{" "}
                            о {order.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order.address}
                          </span>
                        </div>

                        {order.nurse && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Медсестра: <span className="text-foreground">{order.nurse}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}
                        >
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
