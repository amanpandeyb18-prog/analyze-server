import React, { useState, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Save, Image as ImageIcon } from "lucide-react";
import { toast } from "@/components/configurator/hooks/use-toast";
import {
  uploadToAzureBlob,
  formatFileSize,
} from "@/components/configurator/lib/azure-upload";
import Cropper, { Area } from "react-easy-crop";

interface ImageUploadWithCropProps {
  image: string;
  setImage: (image: string) => void;
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
}

export function ImageUploadWithCrop({
  image,
  setImage,
  onUploadStart,
  onUploadComplete,
}: ImageUploadWithCropProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(image);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const createCroppedImage = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas is empty"));
        }
      }, uploadedFile?.type || "image/jpeg");
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);

    // Create preview URL and show cropper
    const localUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(localUrl);
    setPreviewUrl(localUrl);
    setShowCropper(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSaveImage = async () => {
    if (!croppedAreaPixels || !localPreviewUrl || !uploadedFile) return;

    onUploadStart?.();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create cropped image blob
      const croppedBlob = await createCroppedImage(
        localPreviewUrl,
        croppedAreaPixels,
      );

      // Convert blob to File
      const croppedFile = new File([croppedBlob], uploadedFile.name, {
        type: uploadedFile.type,
      });

      // Upload to Azure Blob Storage
      const result = await uploadToAzureBlob(croppedFile, (progress) => {
        setUploadProgress(progress.progress);
      });

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      // Set the Azure blob URL
      setImage(result.url!);
      setPreviewUrl(result.url!);
      setShowCropper(false);

      // Clean up local preview URL
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl("");

      toast({
        title: "Image uploaded successfully",
        description: `${uploadedFile.name} has been uploaded and cropped`,
      });

      onUploadComplete?.();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
    setUploadedFile(null);
    setPreviewUrl("");
    setImage("");
    setShowCropper(false);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Public method to upload cropped image (called from parent on Next)
  const uploadCroppedImage = async (): Promise<boolean> => {
    if (
      !showCropper ||
      !croppedAreaPixels ||
      !localPreviewUrl ||
      !uploadedFile
    ) {
      return true; // No upload needed
    }

    try {
      onUploadStart?.();
      setIsUploading(true);

      const croppedBlob = await createCroppedImage(
        localPreviewUrl,
        croppedAreaPixels,
      );
      const croppedFile = new File([croppedBlob], uploadedFile.name, {
        type: uploadedFile.type,
      });

      const result = await uploadToAzureBlob(croppedFile, (progress) => {
        setUploadProgress(progress.progress);
      });

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      setImage(result.url!);
      setPreviewUrl(result.url!);
      setShowCropper(false);
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl("");

      onUploadComplete?.();
      return true;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      setIsUploading(false);
      return false;
    }
  };

  // Expose uploadCroppedImage method
  React.useImperativeHandle(React.useRef(), () => ({
    uploadCroppedImage,
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image</Label>

        <div className="space-y-3">
          {/* URL Input */}
          <div className="space-y-2">
            <Label
              htmlFor="option-image"
              className="text-sm text-muted-foreground"
            >
              Image URL
            </Label>
            <Input
              id="option-image"
              type="url"
              value={!showCropper ? image : ""}
              onChange={(e) => {
                setImage(e.target.value);
                setPreviewUrl(e.target.value);
                setUploadedFile(null);
                setShowCropper(false);
              }}
              placeholder="https://example.com/image.png"
              disabled={isUploading || showCropper}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 border-t" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 border-t" />
          </div>

          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/50"
            } ${isUploading || showCropper ? "opacity-50 pointer-events-none" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading || showCropper}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-muted">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop an image here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to select from device
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || showCropper}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Max 5MB • PNG, JPG, WEBP
              </p>
            </div>
          </div>

          {/* Cropper UI */}
          {showCropper && localPreviewUrl && (
            <div className="border rounded-lg p-4 bg-muted/50 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Crop Image (Square)
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative h-64 bg-black rounded">
                <Cropper
                  image={localPreviewUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Zoom</Label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                  disabled={isUploading}
                />
              </div>

              {uploadedFile && (
                <p className="text-xs text-muted-foreground">
                  {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
                </p>
              )}

              {isUploading && (
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Uploading file... {uploadProgress}%
                  </p>
                </div>
              )}

              <Button
                type="button"
                onClick={handleSaveImage}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Image
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Preview (uploaded image) */}
          {previewUrl && !showCropper && !isUploading && (
            <div className="relative border rounded-lg p-4 bg-muted/50 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border"
                    onError={() => {
                      setPreviewUrl("");
                      toast({
                        title: "Invalid image",
                        description: "Could not load image preview",
                        variant: "destructive",
                      });
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Image Preview</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {uploadedFile?.name ||
                      new URL(previewUrl).pathname.split("/").pop() ||
                      "Image"}
                  </p>
                  {image && image === previewUrl && (
                    <p className="text-xs text-green-600 font-medium mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      Stored in cloud storage
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add ref forwarding for parent component to call uploadCroppedImage
export type ImageUploadWithCropRef = {
  uploadCroppedImage: () => Promise<boolean>;
};

export const ImageUploadWithCropForwardRef = React.forwardRef<
  ImageUploadWithCropRef,
  ImageUploadWithCropProps
>((props, ref) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(props.image);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const createCroppedImage = async (
    imageSrc: string,
    pixelCrop: Area,
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas is empty"));
        }
      }, uploadedFile?.type || "image/jpeg");
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });
  };

  const uploadCroppedImage = async (): Promise<boolean> => {
    if (
      !showCropper ||
      !croppedAreaPixels ||
      !localPreviewUrl ||
      !uploadedFile
    ) {
      return true;
    }

    try {
      props.onUploadStart?.();
      setIsUploading(true);

      const croppedBlob = await createCroppedImage(
        localPreviewUrl,
        croppedAreaPixels,
      );
      const croppedFile = new File([croppedBlob], uploadedFile.name, {
        type: uploadedFile.type,
      });

      const result = await uploadToAzureBlob(croppedFile, (progress) => {
        setUploadProgress(progress.progress);
      });

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      props.setImage(result.url!);
      setPreviewUrl(result.url!);
      setShowCropper(false);
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl("");

      setIsUploading(false);
      props.onUploadComplete?.();
      return true;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      setIsUploading(false);
      return false;
    }
  };

  React.useImperativeHandle(ref, () => ({
    uploadCroppedImage,
  }));

  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    const localUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(localUrl);
    setPreviewUrl(localUrl);
    setShowCropper(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSaveImage = async () => {
    if (!croppedAreaPixels || !localPreviewUrl || !uploadedFile) return;

    props.onUploadStart?.();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const croppedBlob = await createCroppedImage(
        localPreviewUrl,
        croppedAreaPixels,
      );

      const croppedFile = new File([croppedBlob], uploadedFile.name, {
        type: uploadedFile.type,
      });

      const result = await uploadToAzureBlob(croppedFile, (progress) => {
        setUploadProgress(progress.progress);
      });

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      props.setImage(result.url!);
      setPreviewUrl(result.url!);
      setShowCropper(false);
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl("");

      toast({
        title: "Image uploaded successfully",
        description: `${uploadedFile.name} has been uploaded and cropped`,
      });

      props.onUploadComplete?.();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = () => {
    setUploadedFile(null);
    setPreviewUrl("");
    props.setImage("");
    setShowCropper(false);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image</Label>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label
              htmlFor="option-image"
              className="text-sm text-muted-foreground"
            >
              Image URL
            </Label>
            <Input
              id="option-image"
              type="url"
              value={!showCropper ? props.image : ""}
              onChange={(e) => {
                props.setImage(e.target.value);
                setPreviewUrl(e.target.value);
                setUploadedFile(null);
                setShowCropper(false);
              }}
              placeholder="https://example.com/image.png"
              disabled={isUploading || showCropper}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 border-t" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 border-t" />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-muted-foreground/50"
            } ${isUploading || showCropper ? "opacity-50 pointer-events-none" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading || showCropper}
            />
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-muted">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drag and drop an image here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to select from device
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || showCropper}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select File
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Max 5MB • PNG, JPG, WEBP
              </p>
            </div>
          </div>

          {showCropper && localPreviewUrl && (
            <div className="border rounded-lg p-4 bg-muted/50 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Crop Image (Square)
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative h-64 bg-black rounded">
                <Cropper
                  image={localPreviewUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Zoom</Label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                  disabled={isUploading}
                />
              </div>

              {uploadedFile && (
                <p className="text-xs text-muted-foreground">
                  {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
                </p>
              )}

              {isUploading && (
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Uploading file... {uploadProgress}%
                  </p>
                </div>
              )}

              <Button
                type="button"
                onClick={handleSaveImage}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Image
                  </>
                )}
              </Button>
            </div>
          )}

          {previewUrl && !showCropper && !isUploading && (
            <div className="relative border rounded-lg p-4 bg-muted/50 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border"
                    onError={() => {
                      setPreviewUrl("");
                      toast({
                        title: "Invalid image",
                        description: "Could not load image preview",
                        variant: "destructive",
                      });
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Image Preview</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {uploadedFile?.name ||
                      new URL(previewUrl).pathname.split("/").pop() ||
                      "Image"}
                  </p>
                  {props.image && props.image === previewUrl && (
                    <p className="text-xs text-green-600 font-medium mt-1.5 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      Stored in cloud storage
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ImageUploadWithCropForwardRef.displayName = "ImageUploadWithCropForwardRef";
