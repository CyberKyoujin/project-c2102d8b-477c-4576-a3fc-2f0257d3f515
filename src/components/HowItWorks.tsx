import { ClipboardList, UserCheck, Home, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Створіть замовлення",
    description: "Оберіть потрібну послугу, вкажіть адресу та зручний час",
  },
  {
    icon: UserCheck,
    step: "02",
    title: "Призначимо медсестру",
    description: "Підберемо найближчого вільного спеціаліста для вас",
  },
  {
    icon: Home,
    step: "03",
    title: "Візит додому",
    description: "Медсестра прибуде у призначений час з усім необхідним",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Отримайте допомогу",
    description: "Професійна медична допомога у комфортних умовах",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Як це працює
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Простий процес замовлення медсестри за кілька кроків
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0" />
              )}
              
              <div className="relative z-10 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <item.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {item.step.slice(-1)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
