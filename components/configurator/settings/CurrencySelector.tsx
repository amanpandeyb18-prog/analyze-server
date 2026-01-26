import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Currency, CURRENCIES } from "@/components/configurator/types/settings";
import { DollarSign, Loader2, Save } from "lucide-react";
import { toast } from "@/components/configurator/hooks/use-toast";

interface CurrencySelectorProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => Promise<void>;
  configuratorId?: string;
}

export function CurrencySelector({
  currentCurrency,
  onCurrencyChange,
  configuratorId,
}: CurrencySelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setSelectedCurrency(currentCurrency);
    setHasChanges(false);
  }, [currentCurrency]);

  const handleCurrencySelect = (code: string) => {
    const currency = CURRENCIES.find((c) => c.code === code);
    if (!currency) return;

    setSelectedCurrency(currency);
    setHasChanges(currency.code !== currentCurrency.code);
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsUpdating(true);
    try {
      await onCurrencyChange(selectedCurrency);
      setHasChanges(false);
    } catch (error: any) {
      toast({
        title: "Failed to update currency",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      // Reset to current currency on error
      setSelectedCurrency(currentCurrency);
      setHasChanges(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Currency Settings
        </CardTitle>
        <CardDescription>
          Select the currency for displaying prices throughout the configurator
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={selectedCurrency.code}
            onValueChange={handleCurrencySelect}
            disabled={isUpdating}
          >
            <SelectTrigger id="currency" disabled={isUpdating}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-muted rounded-lg border">
          <h4 className="text-sm font-medium mb-2">Preview</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sample price:</span>
              <span className="font-semibold">
                {selectedCurrency.format(1234.56)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Large amount:</span>
              <span className="font-semibold">
                {selectedCurrency.format(99999.99)}
              </span>
            </div>
          </div>
        </div>

        {hasChanges && (
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-primary font-medium">
              You have unsaved changes
            </p>
            <Button onClick={handleSave} disabled={isUpdating} size="sm">
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
