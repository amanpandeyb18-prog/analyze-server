"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ConfigurationPanel,
  ConfigurationPanelRef,
} from "@/components/configurator/ConfigurationPanel";
import { ProductPreview } from "@/components/configurator/ProductPreview";
import { SummaryPanel } from "@/components/configurator/SummaryPanel";
import { MobileConfigDrawer } from "@/components/configurator/MobileConfigDrawer";
import { SelectedConfigDrawer } from "@/components/configurator/SelectedConfigDrawer";
import { RequestQuoteDialog } from "@/components/configurator/RequestQuoteDialog";
import { ExportDialog } from "@/components/configurator/ExportDialog";
import { AdminDialog } from "@/components/configurator/AdminDialog";
import { SettingsDialog } from "@/components/configurator/SettingsDialog";
import { ThemeCustomizer } from "@/components/configurator/theme/ThemeCustomizer";
import { ConfiguratorThemeProvider } from "@/components/configurator/theme/ConfiguratorThemeProvider";
import { EditableTitle } from "@/components/configurator/EditableTitle";
import { CSVImportDialog } from "@/components/configurator/admin/CSVImportDialog";
import { BillingLimitModal } from "@/components/configurator/BillingLimitModal";
import { ConfiguratorInfoPopup } from "@/components/configurator/admin/ConfiguratorInfoPopup";
import { CurrencyProvider } from "@/components/configurator/contexts/CurrencyContext";
import {
  ConfigCategory,
  ConfigOption,
} from "@/components/configurator/types/configurator";
import { useConfiguration } from "@/components/configurator/hooks/useConfiguration";
import { useConfiguratorData } from "@/components/configurator/hooks/useConfiguratorData";
import { useTheme } from "@/components/configurator/hooks/useTheme";
import { useSettings } from "@/components/configurator/hooks/useSettings";
import { CURRENCIES } from "@/components/configurator/types/settings";
import { Palette, FileText, Upload, Settings } from "lucide-react";
import { toast } from "@/components/configurator/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DEFAULT_BLUE_THEME } from "@/components/configurator/theme/themeConstants";

export interface ConfiguratorAppProps {
  mode: "public" | "admin";
  configuratorId: string;
  publicKey?: string;
  initialData?: any;
}

export default function ConfiguratorApp({
  mode,
  configuratorId,
  publicKey,
  initialData,
}: ConfiguratorAppProps) {
  const isAdminMode = mode === "admin";

  const {
    categories: apiCategories,
    configuratorFound,
    isLoading: isLoadingData,
    configuratorId: retrievedConfiguratorId,
    configurator,
    refetch: refetchConfiguratorData,
  } = useConfiguratorData(configuratorId, publicKey, isAdminMode);

  const {
    state,
    dispatch,
    calculateTotal,
    onAddCategory,
    onUpdateCategory,
    onAddOption,
    onUpdateOption,
    onDeleteCategory,
    onDeleteOption,
  } = useConfiguration(apiCategories);

  const { theme, updateTheme, resetTheme } = useTheme(configurator?.theme);

  // Map database currency to Currency object
  const initialCurrency = configurator?.currency
    ? CURRENCIES.find((c) => c.code === configurator.currency) || CURRENCIES[0]
    : CURRENCIES[0];

  const {
    settings,
    updateCurrency,
    addEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    cloneEmailTemplate,
    setDefaultEmailTemplate,
    formatPrice,
  } = useSettings(initialCurrency);

  const configPanelRef = useRef<ConfigurationPanelRef>(null);
  const [billingLimitModalOpen, setBillingLimitModalOpen] = useState(false);

  // Force admin mode state to match prop
  useEffect(() => {
    if (isAdminMode && !state.isAdminMode) {
      dispatch({ type: "TOGGLE_ADMIN" });
    } else if (!isAdminMode && state.isAdminMode) {
      dispatch({ type: "TOGGLE_ADMIN" });
    }
  }, [isAdminMode, state.isAdminMode, dispatch]);

  // Admin mode should be ONLY based on the mode prop, not compound state
  // This ensures admin features are always visible in admin route
  const adminModeEnabled = isAdminMode;

  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [csvImportDialogOpen, setCsvImportDialogOpen] = useState(false);
  const [adminDialogMode, setAdminDialogMode] = useState<"category" | "option">(
    "category",
  );
  const [selectedCategoryForOption, setSelectedCategoryForOption] =
    useState<string>("");
  const [editingOption, setEditingOption] = useState<ConfigOption | null>(null);
  const [editingCategory, setEditingCategory] = useState<ConfigCategory | null>(
    null,
  );
  const [activeConfiguratorId, setActiveConfiguratorId] = useState<string>("");

  const handleAddCategory = () => {
    setEditingOption(null);
    setEditingCategory(null);
    setAdminDialogMode("category");
    setAdminDialogOpen(true);
  };

  const handleEditCategory = (category: ConfigCategory) => {
    setEditingCategory(category);
    setEditingOption(null);
    setAdminDialogMode("category");
    setAdminDialogOpen(true);
  };

  const handleAddOption = (categoryId: string) => {
    setEditingOption(null);
    setEditingCategory(null);
    setSelectedCategoryForOption(categoryId);
    setAdminDialogMode("option");
    setAdminDialogOpen(true);
  };

  const handleEditOption = (categoryId: string, option: ConfigOption) => {
    setEditingOption(option);
    setEditingCategory(null);
    setSelectedCategoryForOption(categoryId);
    setAdminDialogMode("option");
    setAdminDialogOpen(true);
  };

  const handleCategoryCreated = (categoryId: string) => {
    if (configPanelRef.current) {
      configPanelRef.current.scrollToAndExpandCategory(categoryId);
    }

    setTimeout(() => {
      setSelectedCategoryForOption(categoryId);
      setAdminDialogMode("option");
      setAdminDialogOpen(true);
    }, 100);
  };

  useEffect(() => {
    setActiveConfiguratorId(
      retrievedConfiguratorId || apiCategories[0]?.configuratorId,
    );
  }, [apiCategories, retrievedConfiguratorId]);

  const handleCSVImport = async (
    data: { category: string; options: ConfigOption[] }[],
  ) => {
    for (const { category, options } of data) {
      const existingCategory = state.categories.find(
        (c) => c.name === category,
      );

      if (existingCategory) {
        for (const option of options) {
          const result = await onAddOption(existingCategory.id, option);
          if (result.isLimitError) {
            setBillingLimitModalOpen(true);
            return;
          }
        }
      } else {
        const newCategory: ConfigCategory = {
          id: "",
          name: category,
          options: [],
          relatedCategories: [],
          configuratorId: activeConfiguratorId,
        };

        const createdCategory = await onAddCategory(newCategory);

        if (createdCategory) {
          for (const option of options) {
            const result = await onAddOption(createdCategory.id, option);
            if (result.isLimitError) {
              setBillingLimitModalOpen(true);
              return;
            }
          }
        }
      }
    }
  };

  const handleOptionSelect = (categoryId: string, optionId: string) => {
    dispatch({ type: "SELECT_OPTION", categoryId, optionId });

    const category = state.categories.find((c) => c.id === categoryId);
    const selectedOption = category?.options.find((o) => o.id === optionId);

    if (
      !selectedOption ||
      !selectedOption.incompatibleWith ||
      selectedOption.incompatibleWith.length === 0
    ) {
      return;
    }

    const incompatibleOptionIds = selectedOption.incompatibleWith.map(
      (incomp) => incomp.incompatibleOptionId,
    );

    let deselectedSomething = false;
    const updatedConfig = { ...state.selectedConfig };

    Object.entries(state.selectedConfig).forEach(([catId, optId]) => {
      if (catId === categoryId || !optId) return;

      if (incompatibleOptionIds.includes(optId)) {
        updatedConfig[catId] = "";
        deselectedSomething = true;
      }
    });

    if (deselectedSomething) {
      dispatch({ type: "RESTORE_CONFIG", config: updatedConfig });
      toast({
        title: "Incompatible selections cleared",
        description: `Some options were automatically deselected because they're incompatible with "${selectedOption.label}".`,
      });
    }
  };

  // Show loading
  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading configurator...</p>
        </div>
      </div>
    );
  }

  // Show error if configurator not found
  if (!configuratorFound && configuratorId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-1">Configurator Not Found</p>
            <p>
              The configurator you're looking for doesn't exist or you don't
              have access to it.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show empty configurator message
  if (configuratorFound && apiCategories.length === 0 && !isAdminMode) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-1">Empty Configurator</p>
            <p>
              This configurator has no categories or options configured yet.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ConfiguratorThemeProvider theme={theme}>
      <CurrencyProvider formatPrice={formatPrice}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between admin-toggle-area">
            <EditableTitle
              configuratorId={activeConfiguratorId}
              configuratorName={configurator?.name || "Product Configurator"}
              isAdminMode={adminModeEnabled}
            />
            {adminModeEnabled && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCsvImportDialogOpen(true)}
                  size="sm"
                  className="sm:h-10"
                >
                  <Upload className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Import CSV</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSettingsDialogOpen(true)}
                  size="sm"
                  className="sm:h-10"
                >
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setThemeDialogOpen(true)}
                  size="sm"
                  className="sm:h-10"
                >
                  <Palette className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Theme</span>
                </Button>
              </div>
            )}
          </header>

          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-10 overflow-hidden">
            {/* Mobile: Sticky Product Preview at top */}
            <div className="lg:hidden sticky top-0 z-20 bg-background">
              <ProductPreview
                selectedConfig={state.selectedConfig}
                categories={state.categories}
                totalPrice={formatPrice(calculateTotal())}
                onRequestQuote={() => setQuoteDialogOpen(true)}
                onExport={() => setExportDialogOpen(true)}
                isMobile={true}
              />
            </div>

            {/* Desktop: Configuration Panel */}
            <div className="hidden lg:block lg:col-span-3 lg:h-[calc(100vh-73px)] overflow-y-auto lg:border-r border-border">
              <ConfigurationPanel
                ref={configPanelRef}
                categories={state.categories}
                selectedConfig={state.selectedConfig}
                onOptionSelect={handleOptionSelect}
                isAdminMode={adminModeEnabled}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={onDeleteCategory}
                onAddOption={handleAddOption}
                onEditOption={handleEditOption}
                onDeleteOption={onDeleteOption}
              />
            </div>

            {/* Desktop: Product Preview */}
            <div className="hidden lg:block lg:col-span-4 lg:h-[calc(100vh-73px)] overflow-y-auto lg:border-r border-border preview-panel">
              <ProductPreview
                selectedConfig={state.selectedConfig}
                categories={state.categories}
                totalPrice={formatPrice(calculateTotal())}
                onRequestQuote={() => setQuoteDialogOpen(true)}
                onExport={() => setExportDialogOpen(true)}
                isMobile={false}
              />
            </div>

            {/* Desktop: Summary Panel */}
            <div className="hidden lg:block lg:col-span-3 lg:h-[calc(100vh-73px)] overflow-y-auto summary-panel">
              <SummaryPanel
                categories={state.categories}
                selectedConfig={state.selectedConfig}
                onRemoveOption={(categoryId) => {
                  dispatch({ type: "SELECT_OPTION", categoryId, optionId: "" });
                }}
              />
            </div>

            {/* Mobile: Configuration Drawers */}
            <div className="lg:hidden flex-1 overflow-y-auto pb-24">
              <div className="p-4 space-y-3">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Configure Your Product
                </h2>

                <SelectedConfigDrawer
                  categories={state.categories}
                  selectedConfig={state.selectedConfig}
                  totalPrice={formatPrice(calculateTotal())}
                />

                <div className="pt-2 space-y-3">
                  {state.categories.map((category) => {
                    const selectedOptionId = state.selectedConfig[category.id];
                    const selectedOption = category.options?.find(
                      (o) => o.id === selectedOptionId,
                    );

                    return (
                      <MobileConfigDrawer
                        key={category.id}
                        category={category}
                        selectedOption={selectedOption}
                        onOptionSelect={(optionId) =>
                          handleOptionSelect(category.id, optionId)
                        }
                        selectedConfig={state.selectedConfig}
                        categories={state.categories}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile: Sticky Bottom Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 shadow-lg z-30 quote-export-actions">
              <div className="flex gap-2">
                <Button
                  onClick={() => setQuoteDialogOpen(true)}
                  className="flex-1"
                  size="lg"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Quote
                </Button>
                <Button
                  onClick={() => setExportDialogOpen(true)}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Export
                </Button>
              </div>
            </div>
          </div>

          <ConfiguratorInfoPopup
            isAdminMode={adminModeEnabled}
            configuratorFound={configuratorFound}
          />

          <RequestQuoteDialog
            publicKey={publicKey}
            isAdminMode={isAdminMode}
            open={quoteDialogOpen}
            onOpenChange={setQuoteDialogOpen}
            totalPrice={calculateTotal()}
            categories={state.categories}
            selectedConfig={{
              configuratorId: activeConfiguratorId,
              selectedOptions: state.selectedConfig,
              items: state.categories
                .map((cat) => {
                  const optId = state.selectedConfig[cat.id];
                  const opt = cat.options.find((o) => o.id === optId);
                  return opt
                    ? {
                        sku: opt.sku || opt.id,
                        label: opt.label,
                        price: opt.price,
                      }
                    : null;
                })
                .filter(Boolean) as any[],
            }}
          />

          <SettingsDialog
            open={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
            currency={settings.currency}
            onCurrencyChange={updateCurrency}
            emailTemplates={settings.emailTemplates}
            defaultEmailTemplate={settings.defaultEmailTemplate}
            onAddTemplate={addEmailTemplate}
            onUpdateTemplate={updateEmailTemplate}
            onDeleteTemplate={deleteEmailTemplate}
            onCloneTemplate={cloneEmailTemplate}
            onSetDefaultTemplate={setDefaultEmailTemplate}
            primaryColor={theme.primaryColor}
            configuratorId={activeConfiguratorId}
          />

          <ExportDialog
            open={exportDialogOpen}
            onOpenChange={setExportDialogOpen}
            categories={state.categories}
            selectedConfig={state.selectedConfig}
          />

          <AdminDialog
            open={adminDialogOpen}
            onOpenChange={setAdminDialogOpen}
            mode={adminDialogMode}
            categoryId={selectedCategoryForOption}
            categories={state.categories}
            editingOption={editingOption}
            editingCategory={editingCategory}
            onAddCategory={onAddCategory}
            onUpdateCategory={onUpdateCategory}
            onAddOption={onAddOption}
            onUpdateOption={onUpdateOption}
            onCategoryCreated={handleCategoryCreated}
            onLimitReached={() => setBillingLimitModalOpen(true)}
            configuratorId={activeConfiguratorId}
            onRefetchData={refetchConfiguratorData}
          />

          <ThemeCustomizer
            open={themeDialogOpen}
            onOpenChange={setThemeDialogOpen}
            currentTheme={theme}
            onUpdateTheme={updateTheme}
            onResetTheme={resetTheme}
          />

          <CSVImportDialog
            open={csvImportDialogOpen}
            onOpenChange={setCsvImportDialogOpen}
            categories={state.categories}
            onImport={handleCSVImport}
          />

          <BillingLimitModal
            open={billingLimitModalOpen}
            onOpenChange={setBillingLimitModalOpen}
          />

          <Toaster />
        </div>
      </CurrencyProvider>
    </ConfiguratorThemeProvider>
  );
}
