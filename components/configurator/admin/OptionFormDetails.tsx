import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType } from "@/components/configurator/types/configurator";
import {
  ImageUploadWithCropForwardRef,
  ImageUploadWithCropRef,
} from "@/components/configurator/admin/ImageUploadWithCrop";

interface OptionFormDetailsProps {
  categoryType: CategoryType;
  image: string;
  setImage: (image: string) => void;
  color: string;
  setColor: (color: string) => void;
  voltage: string;
  setVoltage: (voltage: string) => void;
  wattage: string;
  setWattage: (wattage: string) => void;
  materialType: string;
  setMaterialType: (material: string) => void;
  finishType: string;
  setFinishType: (finish: string) => void;
  textValue: string;
  setTextValue: (text: string) => void;
  maxCharacters: string;
  setMaxCharacters: (max: string) => void;
  dimensionWidth: string;
  setDimensionWidth: (width: string) => void;
  dimensionHeight: string;
  setDimensionHeight: (height: string) => void;
  dimensionUnit: string;
  setDimensionUnit: (unit: string) => void;
  imageUploadRef?: React.RefObject<ImageUploadWithCropRef>;
}

export const OptionFormDetails = React.forwardRef<
  ImageUploadWithCropRef,
  OptionFormDetailsProps
>(
  (
    {
      categoryType,
      image,
      setImage,
      color,
      setColor,
      voltage,
      setVoltage,
      wattage,
      setWattage,
      materialType,
      setMaterialType,
      finishType,
      setFinishType,
      textValue,
      setTextValue,
      maxCharacters,
      setMaxCharacters,
      dimensionWidth,
      setDimensionWidth,
      dimensionHeight,
      setDimensionHeight,
      dimensionUnit,
      setDimensionUnit,
      imageUploadRef,
    },
    ref,
  ) => {
    return (
      <div className="space-y-4">
        <ImageUploadWithCropForwardRef
          ref={imageUploadRef || ref}
          image={image}
          setImage={setImage}
        />

        {categoryType === "color" && (
          <div className="space-y-2">
            <Label htmlFor="option-color">Color (Hex)</Label>
            <div className="flex gap-2">
              <Input
                id="option-color"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#FF5733"
              />
              <Input
                type="color"
                value={color || "#000000"}
                onChange={(e) => setColor(e.target.value)}
                className="w-20"
              />
            </div>
          </div>
        )}

        {categoryType === "dimension" && (
          <div className="space-y-2">
            <Label>Dimensions</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={dimensionWidth}
                onChange={(e) => setDimensionWidth(e.target.value)}
                placeholder="Width"
              />
              <Input
                type="number"
                min="0"
                step="0.01"
                value={dimensionHeight}
                onChange={(e) => setDimensionHeight(e.target.value)}
                placeholder="Height"
              />
              <Select value={dimensionUnit} onValueChange={setDimensionUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm">mm</SelectItem>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="m">m</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                  <SelectItem value="ft">ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {categoryType === "power" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="option-voltage">Voltage</Label>
              <Input
                id="option-voltage"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                placeholder="e.g., 220V"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="option-wattage">Wattage</Label>
              <Input
                id="option-wattage"
                value={wattage}
                onChange={(e) => setWattage(e.target.value)}
                placeholder="e.g., 10kW"
              />
            </div>
          </>
        )}

        {categoryType === "material" && (
          <div className="space-y-2">
            <Label htmlFor="option-material">Material Type</Label>
            <Input
              id="option-material"
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
              placeholder="e.g., Steel, Aluminum, Acrylic"
            />
          </div>
        )}

        {categoryType === "finish" && (
          <div className="space-y-2">
            <Label htmlFor="option-finish">Finish Type</Label>
            <Input
              id="option-finish"
              value={finishType}
              onChange={(e) => setFinishType(e.target.value)}
              placeholder="e.g., Gloss, Matte, Brushed"
            />
          </div>
        )}

        {categoryType === "text" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="option-text">Default Text</Label>
              <Input
                id="option-text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="e.g., Custom Engraving"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="option-maxchars">Max Characters</Label>
              <Input
                id="option-maxchars"
                type="number"
                min="1"
                value={maxCharacters}
                onChange={(e) => setMaxCharacters(e.target.value)}
                placeholder="e.g., 50"
              />
            </div>
          </>
        )}
      </div>
    );
  },
);

OptionFormDetails.displayName = "OptionFormDetails";
