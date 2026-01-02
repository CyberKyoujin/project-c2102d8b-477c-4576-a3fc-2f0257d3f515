import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, Calendar, Clock, MapPin, User, Phone, 
  FileText, CheckCircle, Loader2, Star, Camera, X,
  AlertTriangle, MessageSquare, Image as ImageIcon, Video
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

type Order = {
  id: string;
  date: string;
  time: string;
  services: string[];
  address: string;
  status: keyof typeof statusConfig;
  price: number;
  nurse?: string;
  notes?: string;
  phone?: string;
};

// Mock data - in real app, fetch from API
const ordersData: Record<string, Order> = {
  "ORD-001": {
    id: "ORD-001",
    date: "15.01.2026",
    time: "14:00",
    services: ["Крапельниця", "Ін'єкція"],
    address: "вул. Хрещатик, 1, кв. 10",
    status: "completed",
    price: 850,
    nurse: "Марія Іваненко",
    notes: "Вітамінна крапельниця + ін'єкція вітаміну B12",
    phone: "+380 67 123 45 67",
  },
  "ORD-002": {
    id: "ORD-002",
    date: "20.01.2026",
    time: "10:00",
    services: ["Забір аналізів"],
    address: "вул. Хрещатик, 1, кв. 10",
    status: "confirmed",
    price: 450,
    nurse: "Олена Петренко",
    notes: "Загальний аналіз крові + біохімія",
    phone: "+380 67 987 65 43",
  },
};

type MediaFile = {
  id: string;
  type: "image" | "video";
  url: string;
  name: string;
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [feedbackType, setFeedbackType] = useState<"review" | "report" | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const order = orderId ? ordersData[orderId] : null;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Замовлення не знайдено</h1>
            <Link to="/profile">
              <Button variant="hero">Повернутися до профілю</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Файл завеликий",
          description: "Максимальний розмір файлу 50MB",
          variant: "destructive",
        });
        return;
      }

      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      if (!isVideo && !isImage) {
        toast({
          title: "Невірний формат",
          description: "Дозволені лише фото та відео",
          variant: "destructive",
        });
        return;
      }

      const url = URL.createObjectURL(file);
      setMediaFiles((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          type: isVideo ? "video" : "image",
          url,
          name: file.name,
        },
      ]);
    });

    e.target.value = "";
  };

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      toast({
        title: "Помилка",
        description: "Будь ласка, напишіть текст відгуку",
        variant: "destructive",
      });
      return;
    }

    if (feedbackType === "review" && rating === 0) {
      toast({
        title: "Помилка",
        description: "Будь ласка, поставте оцінку",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: feedbackType === "review" ? "Відгук надіслано" : "Скаргу надіслано",
      description: "Дякуємо за ваш зворотний зв'язок!",
    });

    setFeedbackType(null);
    setRating(0);
    setFeedbackText("");
    setMediaFiles([]);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back Button */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад до профілю
          </button>

          {/* Order Header */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground">
                    Замовлення #{order.id}
                  </h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color} mt-1`}>
                    <StatusIcon className="w-4 h-4" />
                    {status.label}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-foreground">{order.price} ₴</p>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Services */}
              <div className="space-y-2">
                <span className="text-muted-foreground text-sm">Послуги</span>
                <div className="flex flex-wrap gap-2">
                  {order.services.map((service) => (
                    <span
                      key={service}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-2">
                <span className="text-muted-foreground text-sm">Дата та час</span>
                <p className="font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {order.date} о {order.time}
                </p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <span className="text-muted-foreground text-sm">Адреса</span>
                <p className="font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {order.address}
                </p>
              </div>

              {/* Nurse */}
              {order.nurse && (
                <div className="space-y-2">
                  <span className="text-muted-foreground text-sm">Медсестра</span>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    {order.nurse}
                  </p>
                  {order.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {order.phone}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mt-6 pt-6 border-t border-border">
                <span className="text-muted-foreground text-sm block mb-2">Примітки</span>
                <p className="text-foreground bg-muted/50 p-4 rounded-xl text-sm">
                  {order.notes}
                </p>
              </div>
            )}

            {/* Actions for non-completed orders */}
            {order.status !== "completed" && (
              <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1">
                  Скасувати замовлення
                </Button>
                <Button variant="hero" className="flex-1">
                  <Phone className="w-4 h-4" />
                  Зв'язатися з медсестрою
                </Button>
              </div>
            )}
          </div>

          {/* Feedback Section */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground mb-4">Зворотний зв'язок</h2>

              {!feedbackType ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setFeedbackType("review")}
                  >
                    <Star className="w-4 h-4" />
                    Залишити відгук
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => setFeedbackType("report")}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Поскаржитись
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Feedback Type Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {feedbackType === "review" ? (
                        <>
                          <MessageSquare className="w-5 h-5 text-primary" />
                          <span className="font-medium text-foreground">Відгук про послугу</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                          <span className="font-medium text-foreground">Скарга на послугу</span>
                        </>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFeedbackType(null);
                        setRating(0);
                        setFeedbackText("");
                        setMediaFiles([]);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Rating - only for reviews */}
                  {feedbackType === "review" && (
                    <div className="space-y-2">
                      <Label>Оцінка</Label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= rating
                                  ? "text-warning fill-warning"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback Text */}
                  <div className="space-y-2">
                    <Label htmlFor="feedback">
                      {feedbackType === "review" ? "Ваш відгук" : "Опишіть проблему"}
                    </Label>
                    <Textarea
                      id="feedback"
                      placeholder={
                        feedbackType === "review"
                          ? "Розкажіть про вашу взаємодію з медсестрою..."
                          : "Детально опишіть, що пішло не так..."
                      }
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-3">
                    <Label>Фото / Відео (опціонально)</Label>
                    <p className="text-sm text-muted-foreground">
                      Додайте фото або відео як доказ (максимум 50MB на файл)
                    </p>

                    {/* Media Preview */}
                    {mediaFiles.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {mediaFiles.map((file) => (
                          <div
                            key={file.id}
                            className="relative aspect-video bg-muted rounded-lg overflow-hidden group"
                          >
                            {file.type === "image" ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={file.url}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => removeMedia(file.id)}
                                className="p-2 bg-destructive rounded-full text-destructive-foreground"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="absolute bottom-1 left-1">
                              {file.type === "video" ? (
                                <Video className="w-4 h-4 text-primary-foreground drop-shadow" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-primary-foreground drop-shadow" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4" />
                      Додати фото або відео
                    </Button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Надсилання...
                      </>
                    ) : feedbackType === "review" ? (
                      "Надіслати відгук"
                    ) : (
                      "Надіслати скаргу"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetails;
