import React from "react";
import { Plus, Minus } from "lucide-react";
import { useCurrency } from "@/components/configurator/contexts/CurrencyContext";

interface QuantityControlsProps {
  categoryId: string;
  quantity: number;
  onQuantityChange: (categoryId: string, quantity: number) => void;
  price?: number;
  min?: number;
}

export function QuantityControls({
  categoryId,
  quantity,
  onQuantityChange,
  price = 0,
  min = 1,
}: QuantityControlsProps) {
  const { formatPrice } = useCurrency();

  return (
    <div className="pt-2 mt-1 flex flex-col gap-1 border-t">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Quantity
        </span>

        <div className="flex items-center rounded-md border border-primary/20 bg-background shadow-sm">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (quantity > min) onQuantityChange(categoryId, quantity - 1);
            }}
            data-testid={`summary-decrement-quantity-${categoryId}`}
            disabled={quantity <= min}
            className="h-7 w-7 flex items-center justify-center rounded-l-md hover:bg-accent transition disabled:opacity-40"
            title="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5 text-primary" />
          </button>

          <span
            className="px-3 text-sm font-semibold text-foreground min-w-[2rem] text-center select-none"
            data-testid={`summary-quantity-display-${categoryId}`}
          >
            {quantity}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(categoryId, quantity + 1);
            }}
            data-testid={`summary-increment-quantity-${categoryId}`}
            className="h-7 w-7 flex items-center justify-center rounded-r-md hover:bg-accent transition"
            title="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5 text-primary" />
          </button>
        </div>
      </div>

      {price && price > 0 && (
        <div className="text-xs text-muted-foreground text-right">
          Subtotal{" "}
          <span className="text-foreground font-medium">
            {formatPrice(price * quantity)}
          </span>
        </div>
      )}
    </div>
  );
}
