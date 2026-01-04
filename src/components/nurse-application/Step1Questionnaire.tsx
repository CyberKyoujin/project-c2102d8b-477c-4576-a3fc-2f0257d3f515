import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApplicationData } from "@/pages/NurseApplication";
import { ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type NurseSpecialization = Database["public"]["Enums"]["nurse_specialization"];

interface Step1Props {
  data: ApplicationData;
  onComplete: (data: Partial<ApplicationData>) => void;
}

const specializations: { id: NurseSpecialization; label: string }[] = [
  { id: "injections", label: "Ін'єкції" },
  { id: "ivs", label: "Крапельниці" },
  { id: "wound_care", label: "Перев'язки" },
  { id: "elderly_care", label: "Догляд за літніми" },
  { id: "pediatric", label: "Педіатрія" },
  { id: "postoperative", label: "Післяопераційний догляд" },
  { id: "palliative", label: "Паліативна допомога" },
  { id: "rehabilitation", label: "Реабілітація" },
];

const cities = [
  "Київ",
  "Харків",
  "Одеса",
  "Дніпро",
  "Запоріжжя",
  "Львів",
  "Вінниця",
  "Полтава",
];

const validSpecializations: NurseSpecialization[] = [
  "injections", "ivs", "wound_care", "elderly_care", 
  "pediatric", "postoperative", "palliative", "rehabilitation"
];

const formSchema = z.object({
  full_name: z.string().min(2, "Ім'я має містити мінімум 2 символи").max(100),
  phone: z.string().regex(/^\+380\d{9}$/, "Введіть номер у форматі +380XXXXXXXXX"),
  email: z.string().email("Введіть коректний email"),
  city: z.string().min(1, "Оберіть місто"),
  experience_years: z.number().min(0).max(50),
  specializations: z.array(z.enum(validSpecializations as [NurseSpecialization, ...NurseSpecialization[]])).min(1, "Оберіть хоча б одну спеціалізацію"),
});

export const Step1Questionnaire = ({ data, onComplete }: Step1Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: data.full_name,
    phone: data.phone || "+380",
    email: data.email,
    city: data.city,
    districts: data.districts,
    has_transport: data.has_transport,
    experience_years: data.experience_years,
    specializations: data.specializations as NurseSpecialization[],
    night_shifts_available: data.night_shifts_available,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSpecializationChange = (specId: NurseSpecialization, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specializations: checked
        ? [...prev.specializations, specId]
        : prev.specializations.filter(s => s !== specId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validated = formSchema.parse({
        ...formData,
        experience_years: Number(formData.experience_years),
      });

      onComplete(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Помилка валідації",
          description: "Перевірте правильність заповнення полів",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name">Повне ім'я *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            placeholder="Іванова Марія Петрівна"
            className={errors.full_name ? "border-destructive" : ""}
          />
          {errors.full_name && <p className="text-sm text-destructive mt-1">{errors.full_name}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+380XXXXXXXXX"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Місто *</Label>
            <Select
              value={formData.city}
              onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
            >
              <SelectTrigger className={errors.city ? "border-destructive" : ""}>
                <SelectValue placeholder="Оберіть місто" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
          </div>

          <div>
            <Label htmlFor="experience">Досвід роботи (років)</Label>
            <Input
              id="experience"
              type="number"
              min={0}
              max={50}
              value={formData.experience_years}
              onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Спеціалізації *</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {specializations.map(spec => (
              <div key={spec.id} className="flex items-center space-x-2">
                <Checkbox
                  id={spec.id}
                  checked={formData.specializations.includes(spec.id)}
                  onCheckedChange={(checked) => handleSpecializationChange(spec.id, checked as boolean)}
                />
                <label
                  htmlFor={spec.id}
                  className="text-sm cursor-pointer"
                >
                  {spec.label}
                </label>
              </div>
            ))}
          </div>
          {errors.specializations && <p className="text-sm text-destructive mt-1">{errors.specializations}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has_transport"
              checked={formData.has_transport}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_transport: checked as boolean }))}
            />
            <label htmlFor="has_transport" className="text-sm cursor-pointer">
              Маю власний транспорт
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="night_shifts"
              checked={formData.night_shifts_available}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, night_shifts_available: checked as boolean }))}
            />
            <label htmlFor="night_shifts" className="text-sm cursor-pointer">
              Готовий/а до нічних викликів
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="hero" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Збереження...
            </>
          ) : (
            <>
              Далі
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
