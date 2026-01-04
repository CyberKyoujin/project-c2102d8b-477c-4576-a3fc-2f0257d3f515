import { Calendar, CheckCircle, Clock, Phone } from "lucide-react";
import { ApplicationData } from "@/pages/NurseApplication";
import { cn } from "@/lib/utils";

interface Step4Props {
  data: ApplicationData;
}

export const Step4Interview = ({ data }: Step4Props) => {
  const isActivated = data.status === "activated";
  const hasInterview = data.interview_scheduled_at;

  if (isActivated) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Вітаємо! Ви в команді! 🎉</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Ваш акаунт медсестри активовано. Тепер ви можете отримувати замовлення через наш додаток.
        </p>
        <div className="bg-muted/50 rounded-xl p-6 max-w-sm mx-auto text-left">
          <h3 className="font-medium mb-4">Наступні кроки:</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
              Завантажте мобільний додаток Сестра24
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
              Увійдіть з вашими обліковими даними
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
              Налаштуйте графік роботи
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
              Почніть отримувати замовлення!
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
        <Calendar className="w-10 h-10 text-primary" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2">
        {hasInterview ? "Інтерв'ю заплановано" : "Очікуйте на запрошення"}
      </h2>
      
      {hasInterview ? (
        <div className="space-y-6 max-w-md mx-auto">
          <p className="text-muted-foreground">
            Ваше інтерв'ю заплановано на:
          </p>
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="flex items-center justify-center gap-2 text-lg font-medium mb-2">
              <Clock className="w-5 h-5 text-primary" />
              {new Date(data.interview_scheduled_at!).toLocaleString("uk-UA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              Інтерв'ю проходитиме онлайн. Посилання буде надіслано на вашу пошту.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-md mx-auto">
          <p className="text-muted-foreground">
            Ви успішно пройшли тест! Наш менеджер зв'яжеться з вами найближчим часом 
            для призначення дати та часу онлайн-інтерв'ю.
          </p>
          
          <div className="bg-muted/50 rounded-xl p-6 text-left">
            <h3 className="font-medium mb-3">Що буде на інтерв'ю:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Знайомство та обговорення вашого досвіду</li>
              <li>• Відповіді на ваші питання про роботу</li>
              <li>• Пояснення умов співпраці</li>
              <li>• Тривалість: близько 20-30 хвилин</li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            Якщо є питання, телефонуйте: 0 800 123 456
          </div>
        </div>
      )}
    </div>
  );
};
