# Сестра24 — Админ-панель

## О проекте

Это админ-панель для сервиса **Сестра24** — платформы вызова медсестёр на дом. Клиентское приложение позволяет пользователям заказывать медицинские услуги, а эта админ-панель предназначена для администраторов и медсестёр.

**Бэкенд:** FastAPI (пишется отдельно)  
**API URL:** `http://localhost:8000` (переменная `VITE_API_URL`)

---

## Роли пользователей

### Admin (Администратор)
- Полный доступ ко всем заказам
- Управление медсёстрами (добавление, редактирование, деактивация)
- Назначение медсестёр на заказы
- Просмотр статистики и аналитики
- Управление услугами и ценами
- Просмотр всех пользователей

### Nurse (Медсестра)
- Просмотр только своих назначенных заказов
- Изменение статуса заказа (confirmed → in_progress → completed)
- Просмотр медкарты пациента
- Добавление заметок к заказу

---

## Типы данных (TypeScript)

### Order (Заказ)

```typescript
type OrderStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

type PaymentMethod = "cash" | "transfer";

type PaymentStatus = "pending" | "paid";

interface Order {
  id: string;                    // "ORD-001"
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
  
  // Клиент
  user_id: string;
  user_name: string;
  user_phone: string;
  user_email?: string;
  
  // Услуги
  services: ServiceItem[];       // Выбранные услуги
  total_price: number;           // Итоговая цена
  
  // Адрес и время
  city: string;                  // "Тернопіль"
  address: string;               // "вул. Шевченка, 10, кв. 5"
  scheduled_date: string;        // "2026-01-20"
  scheduled_time: string;        // "14:00"
  
  // Статус и назначение
  status: OrderStatus;
  assigned_nurse_id?: string;
  assigned_nurse_name?: string;
  
  // Оплата
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  
  // Дополнительно
  notes?: string;                // Заметки клиента
  admin_notes?: string;          // Внутренние заметки
  
  // Медкарта (опционально, для медсестры)
  medical_card?: MedicalCard;
}

interface ServiceItem {
  service_id: string;
  title: string;
  price: number;
  quantity: number;
}
```

### Service (Услуга)

```typescript
type ServiceIcon = "Syringe" | "Droplets" | "Bandage" | "Heart" | "Baby" | "Pill";

interface Service {
  id: string;
  title: string;                 // "Ін'єкції"
  description?: string;
  price: number;                 // Минимальная цена
  icon: ServiceIcon;
  is_active: boolean;
  sort_order: number;
}

// Предустановленные услуги
const SERVICES: Service[] = [
  { id: "injection", title: "Ін'єкції", price: 150, icon: "Syringe" },
  { id: "drip", title: "Крапельниці", price: 300, icon: "Droplets" },
  { id: "bandage", title: "Перев'язки", price: 200, icon: "Bandage" },
  { id: "vitals", title: "Вимірювання показників", price: 100, icon: "Heart" },
  { id: "care", title: "Догляд за хворими", price: 500, icon: "Baby" },
  { id: "meds", title: "Контроль ліків", price: 200, icon: "Pill" },
];
```

### User (Пользователь)

```typescript
interface User {
  id: string;
  created_at: string;
  
  // Основные данные
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  
  // Адрес по умолчанию
  default_city?: string;
  default_address?: string;
  
  birth_date?: string;
  
  // Статистика
  orders_count: number;
  total_spent: number;
}
```

### MedicalCard (Медкарта)

```typescript
interface MedicalCard {
  user_id: string;
  
  blood_type?: string;           // "A+", "B-", "O+" и т.д.
  chronic_conditions?: string;   // Текстовое описание
  allergies: string[];           // ["Пеніцилін", "Йод"]
  medications: string[];         // ["Аспірин 100мг"]
  
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  
  additional_notes?: string;
}
```

### Nurse (Медсестра)

```typescript
interface Nurse {
  id: string;
  created_at: string;
  
  // Аккаунт
  email: string;
  phone: string;
  
  // Персональные данные
  first_name: string;
  last_name: string;
  photo_url?: string;
  
  // Рабочие данные
  is_active: boolean;
  services: string[];            // ID услуг, которые может выполнять
  work_areas: string[];          // Города/районы
  
  // Статистика
  completed_orders: number;
  rating?: number;               // 1-5
}
```

### Admin User (Пользователь админки)

```typescript
type AdminRole = "admin" | "nurse";

interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  nurse_id?: string;             // Если role === "nurse"
  first_name: string;
  last_name: string;
}
```

---

## Статусы заказов

```typescript
const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Очікує",
    labelRu: "Ожидает",
    color: "warning",            // Жёлтый
    icon: "Clock",
    description: "Заказ создан, ожидает подтверждения"
  },
  confirmed: {
    label: "Підтверджено",
    labelRu: "Подтверждён",
    color: "primary",            // Синий
    icon: "CheckCircle",
    description: "Заказ подтверждён, назначена медсестра"
  },
  in_progress: {
    label: "Виконується",
    labelRu: "Выполняется",
    color: "secondary",          // Мятный
    icon: "Loader2",
    description: "Медсестра в пути или на месте"
  },
  completed: {
    label: "Завершено",
    labelRu: "Завершён",
    color: "success",            // Зелёный
    icon: "CheckCircle",
    description: "Услуга оказана"
  },
  cancelled: {
    label: "Скасовано",
    labelRu: "Отменён",
    color: "destructive",        // Красный
    icon: "XCircle",
    description: "Заказ отменён"
  }
};
```

---

## Дизайн-система

### Цветовая палитра (HSL)

```css
/* Светлая тема */
--background: 210 40% 98%;       /* Светло-серый фон */
--foreground: 215 25% 17%;       /* Тёмный текст */

--card: 0 0% 100%;               /* Белые карточки */
--card-foreground: 215 25% 17%;

/* Основной — тёплый голубой */
--primary: 199 89% 48%;          /* #0ea5e9 */
--primary-foreground: 0 0% 100%;

/* Вторичный — мятный */
--secondary: 162 63% 41%;        /* #22c55e подобный */
--secondary-foreground: 0 0% 100%;

/* Акцент — тёплый персиковый */
--accent: 24 95% 64%;            /* Оранжевый */
--accent-foreground: 0 0% 100%;

/* Системные */
--muted: 210 30% 95%;
--muted-foreground: 215 16% 47%;
--destructive: 0 84% 60%;        /* Красный */
--success: 162 63% 41%;          /* Зелёный */
--warning: 38 92% 50%;           /* Жёлтый */

--border: 214 32% 91%;
--radius: 0.75rem;
```

### Шрифты

```css
/* Основной текст */
font-family: 'Inter', sans-serif;

/* Заголовки */
font-family: 'Playfair Display', serif;
```

**Google Fonts импорт:**
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap
```

### Тени и градиенты

```css
--gradient-hero: linear-gradient(135deg, hsl(199 89% 48%) 0%, hsl(162 63% 41%) 100%);
--shadow-soft: 0 4px 20px -4px hsl(215 25% 17% / 0.08);
--shadow-card: 0 8px 30px -8px hsl(215 25% 17% / 0.12);
--shadow-button: 0 4px 14px -3px hsl(199 89% 48% / 0.35);
```

### Утилитарные классы

```css
.gradient-hero { background: var(--gradient-hero); }
.shadow-soft { box-shadow: var(--shadow-soft); }
.shadow-card { box-shadow: var(--shadow-card); }
```

### Анимации

```typescript
// Доступные анимации
"animate-fade-in"      // Появление с движением вверх
"animate-slide-in"     // Появление слева
"animate-pulse-soft"   // Мягкая пульсация
"animate-float"        // Плавание
```

---

## Структура страниц админ-панели

### Для Admin

1. **Dashboard** `/`
   - Статистика за сегодня/неделю/месяц
   - Количество заказов по статусам
   - Список новых заказов (pending)
   - Быстрые действия

2. **Orders** `/orders`
   - Таблица всех заказов с фильтрами
   - Фильтры: статус, дата, медсестра, город
   - Поиск по ID, имени клиента, телефону
   - Пагинация

3. **Order Details** `/orders/:id`
   - Полная информация о заказе
   - Назначение медсестры
   - Изменение статуса
   - История изменений

4. **Nurses** `/nurses`
   - Список медсестёр
   - Добавление/редактирование
   - Статистика по каждой

5. **Users** `/users`
   - Список клиентов
   - Просмотр профиля и истории заказов

6. **Services** `/services`
   - Управление услугами
   - Цены, описания, активность

7. **Settings** `/settings`
   - Настройки системы

### Для Nurse

1. **My Orders** `/`
   - Список назначенных заказов
   - Фильтр по статусу и дате

2. **Order Details** `/orders/:id`
   - Информация о заказе
   - Медкарта пациента
   - Изменение статуса (confirmed → in_progress → completed)
   - Добавление заметок

3. **Profile** `/profile`
   - Личные данные
   - Расписание

---

## API Endpoints (ожидаемые)

### Auth
```
POST   /api/auth/login          # { email, password } → { token, user }
POST   /api/auth/logout
GET    /api/auth/me             # Текущий пользователь
```

### Orders
```
GET    /api/orders              # Список заказов (с фильтрами)
GET    /api/orders/:id          # Детали заказа
PATCH  /api/orders/:id          # Обновление заказа
PATCH  /api/orders/:id/status   # Изменение статуса
PATCH  /api/orders/:id/assign   # Назначение медсестры
```

### Nurses
```
GET    /api/nurses              # Список медсестёр
GET    /api/nurses/:id          # Детали медсестры
POST   /api/nurses              # Создание
PATCH  /api/nurses/:id          # Обновление
```

### Users
```
GET    /api/users               # Список клиентов
GET    /api/users/:id           # Детали клиента
GET    /api/users/:id/medical-card  # Медкарта
```

### Services
```
GET    /api/services            # Список услуг
PATCH  /api/services/:id        # Обновление
```

### Stats
```
GET    /api/stats/dashboard     # Статистика для дашборда
GET    /api/stats/orders        # Статистика заказов
```

---

## Технический стек

- **React 18** + **TypeScript**
- **Vite** — сборщик
- **React Router** — маршрутизация
- **TailwindCSS** — стили
- **Shadcn/ui** — компоненты (sidebar, table, tabs, dialog, etc.)
- **Lucide React** — иконки
- **React Query** (@tanstack/react-query) — кеширование API
- **React Hook Form** + **Zod** — формы и валидация
- **date-fns** — работа с датами

---

## Пример первого сообщения для нового проекта

> Создай админ-панель для медицинского сервиса "Сестра24". 
> 
> Дизайн: тёплый медицинский стиль. Основной цвет — голубой (#0ea5e9), вторичный — мятный. Шрифт заголовков — Playfair Display, текста — Inter. Карточки с мягкими тенями, градиент на кнопках. Скругления 0.75rem.
>
> Роли: Admin (полный доступ) и Nurse (только свои заказы).
>
> Бэкенд на FastAPI, API URL в переменной VITE_API_URL.
>
> Начни с авторизации и sidebar-навигации. Используй Shadcn Sidebar.

---

## Файлы для копирования

При создании нового проекта можно скопировать:
- `src/index.css` — дизайн-токены
- `tailwind.config.ts` — конфигурация Tailwind
- `src/components/ui/*` — Shadcn компоненты
