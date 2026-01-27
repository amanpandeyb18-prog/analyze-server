import { FileDown, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ConfigCategory,
  SelectedConfig,
  SelectedQuantities,
} from "@/components/configurator/types/configurator";
import { useCurrency } from "@/components/configurator/contexts/CurrencyContext";
import jsPDF from "jspdf";
import { toast } from "@/components/configurator/hooks/use-toast";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ConfigCategory[];
  selectedConfig: SelectedConfig;
  selectedQuantities?: SelectedQuantities;
}

export function ExportDialog({
  open,
  onOpenChange,
  categories,
  selectedConfig,
  selectedQuantities = {},
}: ExportDialogProps) {
  const { formatPrice } = useCurrency();
  const calculateTotal = () => {
    let total = 0;
    categories.forEach((category) => {
      const selectedOptionId = selectedConfig[category.id];
      const option = category.options?.find((o) => o.id === selectedOptionId);
      if (option) {
        const quantity = selectedQuantities[category.id] || 1;
        total += Number(option.price) * quantity;
      }
    });
    return total;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      // Title
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Configuration Export", margin, yPos);
      yPos += 15;

      // Subtitle
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on ${new Date().toLocaleString()}`, margin, yPos);
      yPos += 15;

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Configuration Details Section
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Configuration Details", margin, yPos);
      yPos += 10;

      // Draw separator line
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // List all selected options
      categories.forEach((category) => {
        const selectedOptionId = selectedConfig[category.id];
        const option = category.options?.find((o) => o.id === selectedOptionId);

        if (!option) return;

        const quantity = selectedQuantities[category.id] || 1;
        const itemTotal = Number(option.price) * quantity;

        // Check if we need a new page
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = margin;
        }

        // Category name (in blue/primary color)
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(59, 130, 246); // Primary blue color
        doc.text(category.name.toUpperCase(), margin, yPos);
        yPos += 7;

        // Option name with quantity
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        const optionText = quantity > 1 ? `${option.label} (x${quantity})` : option.label;
        doc.text(optionText, margin + 5, yPos);

        // Price (right aligned) - show item total if quantity > 1
        const priceText = quantity > 1 
          ? `${formatPrice(option.price)} each = ${formatPrice(itemTotal)}`
          : formatPrice(option.price);
        const priceWidth = doc.getTextWidth(priceText);
        doc.text(priceText, pageWidth - margin - priceWidth, yPos);
        yPos += 7;

        // Option description
        if (option.description) {
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);

          // Word wrap for description
          const maxWidth = pageWidth - margin * 2 - 5;
          const descLines = doc.splitTextToSize(option.description, maxWidth);
          descLines.forEach((line: string) => {
            if (yPos > pageHeight - 30) {
              doc.addPage();
              yPos = margin;
            }
            doc.text(line, margin + 5, yPos);
            yPos += 5;
          });
        }

        yPos += 8;
        doc.setTextColor(0, 0, 0);
      });

      // Total section
      yPos += 5;

      // Check if we need a new page for total
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = margin;
      }

      // Draw separator line
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Total label and price
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Total Configuration Price", margin, yPos);

      const totalText = formatPrice(total);
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246);
      const totalWidth = doc.getTextWidth(totalText);
      doc.text(totalText, pageWidth - margin - totalWidth, yPos);

      // Reset colors
      doc.setTextColor(0, 0, 0);

      // Footer
      const footer =
        "This is an automated export from the Product Configurator";
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150, 150, 150);
      doc.text(footer, pageWidth / 2, pageHeight - 10, { align: "center" });

      // Save the PDF
      const filename = `configuration-${Date.now()}.pdf`;
      doc.save(filename);

      toast({
        title: "PDF Exported",
        description: "Your configuration has been exported successfully.",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const total = calculateTotal();
  console.log("Total:", total, typeof total);
  console.log("Formatted:", formatPrice(total));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Export Configuration</DialogTitle>
        </DialogHeader>

        <h3 className="font-semibold text-lg">Configuration Summary</h3>

        {/* Scrollable categories section */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-4">
          {categories.map((category) => {
            const selectedOptionId = selectedConfig[category.id];
            const option = category.options?.find(
              (o) => o.id === selectedOptionId,
            );

            if (!option) return null;

            const quantity = selectedQuantities[category.id] || 1;
            const itemTotal = Number(option.price) * quantity;

            return (
              <Card
                key={category.id}
                className="p-4 bg-accent/30 gap-0 border-primary/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {category.name}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {quantity > 1 ? (
                      <span>
                        {formatPrice(option.price)} x {quantity} = {formatPrice(itemTotal)}
                      </span>
                    ) : (
                      formatPrice(option.price)
                    )}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {option.label} {quantity > 1 && <span className="text-primary">(x{quantity})</span>}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Sticky total and buttons section */}
        <div className="border-t border-border pt-4 space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">
              Total Configuration Price
            </span>
            <span className="text-3xl font-bold text-primary">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              data-testid="export-cancel-button"
            >
              Cancel
            </Button>
            <Button onClick={handleExportPDF} data-testid="export-pdf-button">
              <FileDown className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
