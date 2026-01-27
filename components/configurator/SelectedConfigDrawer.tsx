import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ConfigCategory, SelectedConfig, SelectedQuantities } from "@/components/configurator/types/configurator";
import { useCurrency } from "@/components/configurator/contexts/CurrencyContext";
import { List, Plus, Minus } from "lucide-react";

interface SelectedConfigDrawerProps {
  categories: ConfigCategory[];
  selectedConfig: SelectedConfig;
  selectedQuantities: SelectedQuantities;
  totalPrice: string;
  onQuantityChange: (categoryId: string, quantity: number) => void;
}

export function SelectedConfigDrawer({
  categories,
  selectedConfig,
  selectedQuantities,
  totalPrice,
  onQuantityChange,
}: SelectedConfigDrawerProps) {
  const { formatPrice } = useCurrency();
  const hasSelections = Object.values(selectedConfig).some((val) => val !== "");

  const selectedItems = categories
    .map((category) => {
      const selectedOptionId = selectedConfig[category.id];
      const option = category.options?.find((o) => o.id === selectedOptionId);
      return option ? { category, option } : null;
    })
    .filter(Boolean);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-full bg-card border-2 border-primary/20 hover:border-primary/40 active:scale-[0.98] touch-manipulation"
        >
          <List className="h-5 w-5 mr-2" />
          View Selected Configuration ({selectedItems.length})
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Your Configuration</DrawerTitle>
          <DrawerDescription>
            Review all selected options and total price
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-4">
          {!hasSelections ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-base">No options selected yet</p>
              <p className="text-sm mt-2">
                Configure your product to see selections here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedItems.map((item) => {
                if (!item) return null;
                const { category, option } = item;

                return (
                  <div
                    key={category.id}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
                      {category.name}
                    </p>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-base">
                          {option.label}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                      <p className="font-bold text-lg text-foreground ml-4">
                        {formatPrice(option.price)}
                      </p>
                    </div>

                    {/* Quantity Controls for Mobile */}
                    <div className="mt-3 pt-3 border-t border-primary/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          Quantity:
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const currentQty = selectedQuantities[category.id] || 1;
                              if (currentQty > 1) {
                                onQuantityChange(category.id, currentQty - 1);
                              }
                            }}
                            data-testid={`mobile-decrement-quantity-${category.id}`}
                            className="h-9 w-9 rounded-md border-2 border-primary bg-background active:bg-accent flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                            disabled={(selectedQuantities[category.id] || 1) <= 1}
                          >
                            <Minus className="h-4 w-4 text-primary" />
                          </button>
                          <span 
                            className="text-lg font-bold text-foreground min-w-[3rem] text-center"
                            data-testid={`mobile-quantity-display-${category.id}`}
                          >
                            {selectedQuantities[category.id] || 1}
                          </span>
                          <button
                            onClick={() => {
                              const currentQty = selectedQuantities[category.id] || 1;
                              onQuantityChange(category.id, currentQty + 1);
                            }}
                            data-testid={`mobile-increment-quantity-${category.id}`}
                            className="h-9 w-9 rounded-md border-2 border-primary bg-background active:bg-accent flex items-center justify-center transition-colors touch-manipulation"
                          >
                            <Plus className="h-4 w-4 text-primary" />
                          </button>
                        </div>
                      </div>
                      {option.price > 0 && (
                        <div className="mt-2 text-sm font-medium text-foreground text-right">
                          Subtotal: {formatPrice(option.price * (selectedQuantities[category.id] || 1))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Total Price */}
              <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 mt-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Price
                </p>
                <p className="text-4xl font-bold text-primary">{totalPrice}</p>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="pt-4 border-t">
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
