import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  onStepClick?: (stepIndex: number) => void;
  allowNonLinear?: boolean;
}

export function Stepper({
  steps,
  currentStep,
  className,
  onStepClick,
  allowNonLinear = false,
}: StepperProps) {
  const handleStepClick = (index: number) => {
    if (allowNonLinear && onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;
          const isClickable = allowNonLinear && onStepClick;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-background text-primary",
                    !isCompleted &&
                      !isCurrent &&
                      "border-muted bg-background text-muted-foreground",
                    isClickable &&
                      "cursor-pointer hover:scale-110 transition-transform",
                    !isClickable && "cursor-default",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors",
                    isCompleted ? "bg-primary" : "bg-muted",
                  )}
                  style={{ marginBottom: "40px" }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
