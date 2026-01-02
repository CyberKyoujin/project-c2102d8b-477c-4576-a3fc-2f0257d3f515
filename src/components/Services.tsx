import { Syringe, Droplets, Bandage, Heart, Baby, Pill } from "lucide-react";

const services = [
  {
    icon: Syringe,
    title: "Ін'єкції",
    description: "Внутрішньом'язові та підшкірні ін'єкції з дотриманням усіх стандартів",
    price: "від 150 ₴",
  },
  {
    icon: Droplets,
    title: "Крапельниці",
    description: "Внутрішньовенні інфузії під наглядом досвідченої медсестри",
    price: "від 300 ₴",
  },
  {
    icon: Bandage,
    title: "Перев'язки",
    description: "Професійна обробка ран та післяопераційний догляд",
    price: "від 200 ₴",
  },
  {
    icon: Heart,
    title: "Вимірювання показників",
    description: "Тиск, пульс, рівень цукру, температура та ЕКГ",
    price: "від 100 ₴",
  },
  {
    icon: Baby,
    title: "Догляд за хворими",
    description: "Патронаж літніх людей та післяопераційний догляд вдома",
    price: "від 500 ₴/год",
  },
  {
    icon: Pill,
    title: "Контроль прийому ліків",
    description: "Нагадування та допомога з правильним прийомом препаратів",
    price: "від 200 ₴",
  },
];

const Services = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Наші послуги
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Повний спектр медсестринських послуг у зручний для вас час
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {service.description}
              </p>
              <p className="text-lg font-semibold text-primary">
                {service.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
