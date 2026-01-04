import { Check, FileText, ClipboardCheck, Video, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  applicationStatus: string;
}

const steps = [
  { id: 1, title: "Анкета", icon: FileText },
  { id: 2, title: "Документи", icon: ClipboardCheck },
  { id: 3, title: "Тест", icon: Check },
  { id: 4, title: "Інтерв'ю", icon: Video },
];

export const StepIndicator = ({ currentStep, applicationStatus }: StepIndicatorProps) => {
  const isCompleted = (stepId: number) => {
    if (applicationStatus === "activated") return true;
    return stepId < currentStep;
  };

  const isCurrent = (stepId: number) => stepId === currentStep;

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const completed = isCompleted(step.id);
        const current = isCurrent(step.id);

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all",
                  completed
                    ? "bg-primary text-primary-foreground"
                    : current
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs md:text-sm font-medium text-center",
                  current ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-1 mx-2 md:mx-4 rounded",
                  completed ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
