import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ConfigOption,
  ConfigCategory,
  CategoryType,
  ConfigAttribute,
} from "@/components/configurator/types/configurator";
import { CategoryForm } from "@/components/configurator/admin/CategoryForm";
import { OptionFormBasic } from "@/components/configurator/admin/OptionFormBasic";
import { OptionFormDetails } from "@/components/configurator/admin/OptionFormDetails";
import { OptionFormCompatibility } from "@/components/configurator/admin/OptionFormCompatibility";
import { OptionAttributeValues } from "@/components/configurator/admin/OptionAttributeValues";
import { Stepper } from "@/components/ui/stepper";
import { ImageUploadWithCropRef } from "@/components/configurator/admin/ImageUploadWithCrop";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Save,
  Plus,
  X,
} from "lucide-react";

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "category" | "option";
  categoryId?: string;
  categories?: ConfigCategory[];
  editingOption?: ConfigOption | null;
  editingCategory?: ConfigCategory | null;
  onAddCategory?: (category: ConfigCategory) => Promise<ConfigCategory | null>;
  onUpdateCategory?: (category: ConfigCategory) => Promise<void>;
  onAddOption?: (
    categoryId: string,
    option: ConfigOption,
  ) => Promise<{ success: boolean; isLimitError?: boolean }>;
  onUpdateOption?: (categoryId: string, option: ConfigOption) => Promise<void>;
  onCategoryCreated?: (categoryId: string) => void;
  onLimitReached?: () => void;
  configuratorId: string;
  onRefetchData?: () => void;
}

export function AdminDialog({
  open,
  onOpenChange,
  mode,
  categoryId,
  categories = [],
  editingOption = null,
  editingCategory = null,
  onAddCategory,
  onUpdateCategory,
  onAddOption,
  onUpdateOption,
  onCategoryCreated,
  onLimitReached,
  configuratorId,
  onRefetchData,
}: AdminDialogProps) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<CategoryType>("GENERIC");
  const [categoryIsPrimary, setCategoryIsPrimary] = useState(false);
  const [categoryAttributesTemplate, setCategoryAttributesTemplate] = useState<
    ConfigAttribute[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  // Option form state
  const [optionLabel, setOptionLabel] = useState("");
  const [optionPrice, setOptionPrice] = useState("");
  const [optionDescription, setOptionDescription] = useState("");
  const [optionImage, setOptionImage] = useState("");
  const [optionColor, setOptionColor] = useState("");
  const [optionVoltage, setOptionVoltage] = useState("");
  const [optionWattage, setOptionWattage] = useState("");
  const [optionMaterialType, setOptionMaterialType] = useState("");
  const [optionFinishType, setOptionFinishType] = useState("");
  const [optionTextValue, setOptionTextValue] = useState("");
  const [optionMaxCharacters, setOptionMaxCharacters] = useState("");
  const [optionDimensionWidth, setOptionDimensionWidth] = useState("");
  const [optionDimensionHeight, setOptionDimensionHeight] = useState("");
  const [optionDimensionUnit, setOptionDimensionUnit] = useState("mm");
  const [optionAttributeValues, setOptionAttributeValues] = useState<
    Record<string, any>
  >({});

  const [selectedIncompatibilities, setSelectedIncompatibilities] = useState<
    string[]
  >([]);
  const [compatibilitySearch, setCompatibilitySearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Stepper state for option mode
  const [currentStep, setCurrentStep] = useState(0);
  const imageUploadRef = useRef<ImageUploadWithCropRef>(null);

  const optionSteps = [
    { label: "Basic", description: "Name & price" },
    { label: "Details", description: "Image & specs" },
    { label: "Attributes", description: "Custom fields" },
    { label: "Advanced", description: "Compatibility" },
  ];

  const currentCategory = categories.find((cat) => cat.id === categoryId);
  const currentCategoryType = currentCategory?.categoryType || "generic";

  useEffect(() => {
    if (open) {
      if (editingOption) {
        setOptionLabel(editingOption.label);
        setOptionPrice(editingOption.price.toString());
        setOptionDescription(editingOption.description);
        setOptionImage(editingOption.image || "");
        setOptionColor(editingOption.color || "");
        setOptionVoltage(editingOption.voltage || "");
        setOptionWattage(editingOption.wattage || "");
        setOptionMaterialType(editingOption.materialType || "");
        setOptionFinishType(editingOption.finishType || "");
        setOptionTextValue(editingOption.textValue || "");
        setOptionMaxCharacters(editingOption.maxCharacters?.toString() || "");
        setOptionDimensionWidth(
          editingOption.dimensions?.width.toString() || "",
        );
        setOptionDimensionHeight(
          editingOption.dimensions?.height.toString() || "",
        );
        setOptionDimensionUnit(editingOption.dimensions?.unit || "mm");
        setOptionAttributeValues(editingOption.attributeValues || {});
        // preserve existing incompatibilities when editing
        setSelectedIncompatibilities(editingOption.incompatibleWith || []);
      } else if (editingCategory) {
        setCategoryName(editingCategory.name);
        setCategoryType(
          (editingCategory.categoryType || "generic") as CategoryType,
        );
        setCategoryIsPrimary(editingCategory.isPrimary || false);
        setCategoryAttributesTemplate(editingCategory.attributesTemplate || []);
      } else if (mode === "option") {
        resetOptionForm();
      } else if (mode === "category") {
        resetCategoryForm();
      }
      setCompatibilitySearch("");
      setShowAllCategories(false);
      setCurrentStep(0); // Reset stepper
    }
  }, [open, editingOption, editingCategory, mode]);

  const resetOptionForm = () => {
    setOptionLabel("");
    setOptionPrice("");
    setOptionDescription("");
    setOptionImage("");
    setOptionColor("");
    setOptionVoltage("");
    setOptionWattage("");
    setOptionMaterialType("");
    setOptionFinishType("");
    setOptionTextValue("");
    setOptionMaxCharacters("");
    setOptionDimensionWidth("");
    setOptionDimensionHeight("");
    setOptionDimensionUnit("mm");
    setOptionAttributeValues({});
    setSelectedIncompatibilities([]);
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryType("GENERIC");
    setCategoryIsPrimary(false);
    setCategoryAttributesTemplate([]);
  };

  const handleStepClick = (stepIndex: number) => {
    // Only allow step clicking in edit mode
    if (editingOption) {
      setCurrentStep(stepIndex);
    }
  };

  const handleNext = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any form submission
    e?.preventDefault();
    e?.stopPropagation();

    // If on Details step and cropper is active, upload image
    if (currentStep === 1 && imageUploadRef.current) {
      const uploaded = await imageUploadRef.current.uploadCroppedImage();
      if (!uploaded) {
        return; // Don't proceed if upload failed
      }
    }

    if (currentStep < optionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any form submission
    e?.preventDefault();
    e?.stopPropagation();

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: Only allow submission on final step for option mode
    if (mode === "option" && currentStep < optionSteps.length - 1) {
      console.warn("Form submission blocked: not on final step");
      return;
    }

    setIsSaving(true);

    try {
      if (mode === "category") {
        if (editingCategory && onUpdateCategory) {
          await onUpdateCategory({
            ...editingCategory,
            name: categoryName,
            categoryType,
            isPrimary: categoryIsPrimary,
            attributesTemplate:
              categoryAttributesTemplate.length > 0
                ? categoryAttributesTemplate
                : undefined,
          });
          onOpenChange(false);
        } else if (onAddCategory) {
          // Don't generate temporary ID - let backend create it
          const createdCategory = await onAddCategory({
            id: "", // Backend will assign the real ID
            name: categoryName,
            categoryType,
            isPrimary: categoryIsPrimary,
            options: [],
            relatedCategories: [],
            attributesTemplate:
              categoryAttributesTemplate.length > 0
                ? categoryAttributesTemplate
                : undefined,
            configuratorId,
          });

          resetCategoryForm();
          onOpenChange(false);

          // Trigger option form with the REAL category ID from backend
          if (createdCategory && onCategoryCreated) {
            onCategoryCreated(createdCategory.id);
          }
        }
      } else if (mode === "option" && categoryId) {
        const optionPayload: ConfigOption = {
          id: editingOption?.id || `option-${Date.now()}`,
          label: optionLabel,
          price: parseFloat(optionPrice) || 0,
          description: optionDescription,
          imageUrl: optionImage || undefined,
          attributeValues:
            Object.keys(optionAttributeValues).length > 0
              ? optionAttributeValues
              : undefined,
          // include incompatibilities in payload (backend expects `incompatibleWith`)
          incompatibleWith:
            selectedIncompatibilities.length > 0
              ? selectedIncompatibilities
              : [],
        };

        if (currentCategoryType === "color" && optionColor) {
          optionPayload.color = optionColor;
        }
        if (currentCategoryType === "power") {
          if (optionVoltage) optionPayload.voltage = optionVoltage;
          if (optionWattage) optionPayload.wattage = optionWattage;
        }
        if (currentCategoryType === "material" && optionMaterialType) {
          optionPayload.materialType = optionMaterialType;
        }
        if (currentCategoryType === "finish" && optionFinishType) {
          optionPayload.finishType = optionFinishType;
        }
        if (currentCategoryType === "text") {
          if (optionTextValue) optionPayload.textValue = optionTextValue;
          if (optionMaxCharacters)
            optionPayload.maxCharacters = parseInt(optionMaxCharacters);
        }
        if (
          currentCategoryType === "dimension" &&
          optionDimensionWidth &&
          optionDimensionHeight
        ) {
          optionPayload.dimensions = {
            width: parseFloat(optionDimensionWidth),
            height: parseFloat(optionDimensionHeight),
            unit: optionDimensionUnit,
          };
        }

        if (editingOption && onUpdateOption) {
          await onUpdateOption(categoryId, optionPayload);
          resetOptionForm();
          onOpenChange(false);
          // Refetch data to update incompatibility state
          if (onRefetchData) {
            onRefetchData();
          }
        } else if (onAddOption) {
          const result = await onAddOption(categoryId, optionPayload);
          if (result.isLimitError) {
            resetOptionForm();
            onOpenChange(false);
            if (onLimitReached) {
              onLimitReached();
            }
          } else if (result.success) {
            resetOptionForm();
            onOpenChange(false);
            // Refetch data to update incompatibility state
            if (onRefetchData) {
              onRefetchData();
            }
          }
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const toggleIncompatibility = (optionId: string) => {
    setSelectedIncompatibilities((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "category"
              ? editingCategory
                ? "Edit Category"
                : "Add New Category"
              : editingOption
                ? "Edit Option"
                : "Add New Option"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "category" ? (
            <CategoryForm
              categoryName={categoryName}
              setCategoryName={setCategoryName}
              categoryType={categoryType}
              setCategoryType={setCategoryType}
              isEditing={!!editingCategory}
              hasOptions={(editingCategory?.options.length || 0) > 0}
              attributesTemplate={categoryAttributesTemplate}
              setAttributesTemplate={setCategoryAttributesTemplate}
              isPrimary={categoryIsPrimary}
              setIsPrimary={setCategoryIsPrimary}
              hasPrimaryCategory={categories.some(
                (cat) => cat.isPrimary && cat.id !== editingCategory?.id,
              )}
            />
          ) : (
            <div className="space-y-6">
              {/* Stepper */}
              <Stepper
                steps={optionSteps}
                currentStep={currentStep}
                onStepClick={handleStepClick}
                allowNonLinear={!!editingOption}
              />

              {/* Step Content */}
              <div className="min-h-[300px]">
                {currentStep === 0 && (
                  <OptionFormBasic
                    label={optionLabel}
                    setLabel={setOptionLabel}
                    price={optionPrice}
                    setPrice={setOptionPrice}
                    description={optionDescription}
                    setDescription={setOptionDescription}
                  />
                )}

                {currentStep === 1 && (
                  <OptionFormDetails
                    ref={imageUploadRef}
                    categoryType={currentCategoryType as CategoryType}
                    image={optionImage}
                    setImage={setOptionImage}
                    color={optionColor}
                    setColor={setOptionColor}
                    voltage={optionVoltage}
                    setVoltage={setOptionVoltage}
                    wattage={optionWattage}
                    setWattage={setOptionWattage}
                    materialType={optionMaterialType}
                    setMaterialType={setOptionMaterialType}
                    finishType={optionFinishType}
                    setFinishType={setOptionFinishType}
                    textValue={optionTextValue}
                    setTextValue={setOptionTextValue}
                    maxCharacters={optionMaxCharacters}
                    setMaxCharacters={setOptionMaxCharacters}
                    dimensionWidth={optionDimensionWidth}
                    setDimensionWidth={setOptionDimensionWidth}
                    dimensionHeight={optionDimensionHeight}
                    setDimensionHeight={setOptionDimensionHeight}
                    dimensionUnit={optionDimensionUnit}
                    setDimensionUnit={setOptionDimensionUnit}
                    imageUploadRef={imageUploadRef}
                  />
                )}

                {currentStep === 2 && (
                  <OptionAttributeValues
                    attributesTemplate={
                      currentCategory?.attributesTemplate || []
                    }
                    attributeValues={optionAttributeValues}
                    setAttributeValues={setOptionAttributeValues}
                  />
                )}

                {currentStep === 3 && (
                  <OptionFormCompatibility
                    categories={categories}
                    currentCategoryId={categoryId}
                    selectedIncompatibilities={selectedIncompatibilities}
                    onToggleIncompatibility={toggleIncompatibility}
                    compatibilitySearch={compatibilitySearch}
                    setCompatibilitySearch={setCompatibilitySearch}
                    showAllCategories={showAllCategories}
                    setShowAllCategories={setShowAllCategories}
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            {mode === "option" ? (
              <>
                {/* Stepper Navigation */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isSaving}
                  className="flex-1"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                {currentStep < optionSteps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 gap-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingOption ? (
                          <>
                            <Save className="h-4 w-4" />
                            Update Option
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            Add Option
                          </>
                        )}
                      </>
                    )}
                  </Button>
                )}
              </>
            ) : (
              <>
                {/* Category Mode Buttons */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 gap-2"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingCategory ? (
                        <>
                          <Save className="h-4 w-4" />
                          Update Category
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add Category
                        </>
                      )}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
