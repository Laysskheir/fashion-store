"use client";

import { Check, X } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Variant {
  id: string;
  color: string;
  size: string;
  inventory: number;
  price: number;
  sku: string;
  imageUrl?: string;
}

interface VariantSelectorProps {
  variants: Variant[];
  onVariantSelect: (variant: Variant | null) => void;
  selectedVariant?: Variant | null;
  className?: string;
  disabled?: boolean;
}

type VariantMap = Map<string, Variant>;
type AvailabilityMap = Map<string, Set<string>>;

export const VariantSelector = ({
  variants,
  onVariantSelect,
  selectedVariant,
  className,
  disabled = false,
}: VariantSelectorProps) => {
  // State management
  const [selectedColor, setSelectedColor] = useState<string | null>(
    selectedVariant?.color || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    selectedVariant?.size || null
  );
  const [error, setError] = useState<string | null>(null);

  // Reset selections when variants change or component is disabled
  useEffect(() => {
    if (variants.length === 0 || disabled) {
      setSelectedColor(null);
      setSelectedSize(null);
      onVariantSelect(null);
    }
  }, [variants, disabled, onVariantSelect]);

  // Memoized computations for variant data
  const { 
    uniqueColors, 
    uniqueSizes, 
    variantMap,
    colorToSizes,
    sizeToColors,
    minPrice,
    maxPrice
  } = useMemo(() => {
    const colors = new Set<string>();
    const sizes = new Set<string>();
    const vMap: VariantMap = new Map();
    const colorSizes: AvailabilityMap = new Map();
    const sizeColors: AvailabilityMap = new Map();
    let min = Infinity;
    let max = -Infinity;

    variants.forEach((variant) => {
      // Build variant map
      const key = `${variant.color}-${variant.size}`;
      vMap.set(key, variant);

      // Track unique colors and sizes
      colors.add(variant.color);
      sizes.add(variant.size);

      // Build color-to-sizes map with inventory check
      if (variant.inventory > 0) {
        if (!colorSizes.has(variant.color)) {
          colorSizes.set(variant.color, new Set());
        }
        colorSizes.get(variant.color)?.add(variant.size);

        // Build size-to-colors map with inventory check
        if (!sizeColors.has(variant.size)) {
          sizeColors.set(variant.size, new Set());
        }
        sizeColors.get(variant.size)?.add(variant.color);
      }

      // Track price range
      min = Math.min(min, variant.price);
      max = Math.max(max, variant.price);
    });

    return {
      uniqueColors: Array.from(colors),
      uniqueSizes: Array.from(sizes),
      variantMap: vMap,
      colorToSizes: colorSizes,
      sizeToColors: sizeColors,
      minPrice: min === Infinity ? 0 : min,
      maxPrice: max === -Infinity ? 0 : max
    };
  }, [variants]);

  // Memoized helper functions
  const getVariantInfo = useCallback((color: string, size: string) => {
    return variantMap.get(`${color}-${size}`) || null;
  }, [variantMap]);

  const isColorAvailable = useCallback((color: string, selectedSize: string | null) => {
    if (!selectedSize) return colorToSizes.has(color);
    return colorToSizes.get(color)?.has(selectedSize) ?? false;
  }, [colorToSizes]);

  const isSizeAvailable = useCallback((size: string, selectedColor: string | null) => {
    if (!selectedColor) return sizeToColors.has(size);
    return sizeToColors.get(size)?.has(selectedColor) ?? false;
  }, [sizeToColors]);

  // Selection handlers with improved logic
  const handleColorSelect = useCallback((color: string) => {
    setError(null);
    
    // If no sizes available for this color, reset
    if (!colorToSizes.has(color)) {
      setError(`No available sizes for ${color}`);
      setSelectedColor(null);
      setSelectedSize(null);
      onVariantSelect(null);
      return;
    }

    setSelectedColor(color);
    
    // If size was already selected, validate the new combination
    if (selectedSize) {
      const variant = getVariantInfo(color, selectedSize);
      if (variant && variant.inventory > 0) {
        onVariantSelect(variant);
      } else {
        setError(`${color} not available in size ${selectedSize}`);
        onVariantSelect(null);
      }
    }
  }, [selectedSize, colorToSizes, getVariantInfo, onVariantSelect]);

  const handleSizeSelect = useCallback((size: string) => {
    setError(null);
    
    // If no colors available for this size, reset
    if (!sizeToColors.has(size)) {
      setError(`No available colors in size ${size}`);
      setSelectedSize(null);
      setSelectedColor(null);
      onVariantSelect(null);
      return;
    }

    setSelectedSize(size);
    
    // If color was already selected, validate the new combination
    if (selectedColor) {
      const variant = getVariantInfo(selectedColor, size);
      if (variant && variant.inventory > 0) {
        onVariantSelect(variant);
      } else {
        setError(`Size ${size} not available in ${selectedColor}`);
        onVariantSelect(null);
      }
    }
  }, [selectedColor, sizeToColors, getVariantInfo, onVariantSelect]);

  // Render color selection buttons
  const renderColorButtons = () => {
    return uniqueColors.map((color) => {
      const isSelected = selectedColor === color;
      const availableSizes = colorToSizes.get(color) || new Set();
      const isAvailable = availableSizes.size > 0;

      return (
        <TooltipProvider key={color}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleColorSelect(color)}
                className={cn(
                  "relative flex h-11 w-11 items-center justify-center rounded-full border transition-all",
                  isSelected 
                    ? "ring-2 ring-primary border-primary" 
                    : "border-input hover:border-primary",
                  !isAvailable && "opacity-50 cursor-not-allowed"
                )}
                disabled={!isAvailable || disabled}
                style={{ 
                  backgroundColor: color, 
                  // Ensure visibility for light colors
                  border: isSelected ? '2px solid currentColor' : '1px solid currentColor'
                }}
                aria-label={`Select ${color} color`}
                aria-pressed={isSelected}
                aria-disabled={!isAvailable}
              >
                {isSelected && (
                  <Check 
                    className="h-5 w-5 text-white drop-shadow-md" 
                    strokeWidth={3} 
                    aria-hidden="true" 
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {color} 
              {isAvailable 
                ? ` - ${availableSizes.size} size${availableSizes.size !== 1 ? 's' : ''} available` 
                : ' - Out of Stock'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    });
  };

  // Render size selection buttons
  const renderSizeButtons = () => {
    return uniqueSizes.map((size) => {
      const isSelected = selectedSize === size;
      const availableColors = sizeToColors.get(size) || new Set();
      const isAvailable = availableColors.size > 0;

      return (
        <button
          key={size}
          onClick={() => handleSizeSelect(size)}
          className={cn(
            "px-4 py-2 rounded-md border text-sm transition-all",
            isSelected 
              ? "bg-primary text-primary-foreground" 
              : "bg-background hover:bg-accent",
            !isAvailable && "opacity-50 cursor-not-allowed line-through"
          )}
          disabled={!isAvailable || disabled}
          aria-label={`Select ${size} size`}
          aria-pressed={isSelected}
          aria-disabled={!isAvailable}
        >
          {size}
        </button>
      );
    });
  };

  // Render final variant details
  const renderVariantDetails = () => {
    if (!selectedColor || !selectedSize) return null;

    const variant = getVariantInfo(selectedColor, selectedSize);
    
    if (!variant) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            No variant available for {selectedColor} in size {selectedSize}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="mt-4 space-y-2 bg-accent/50 p-3 rounded-md">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">${variant.price}</span>
          <span 
            className={cn(
              "text-sm font-medium",
              variant.inventory > 5 ? "text-green-600" : 
              variant.inventory > 0 ? "text-yellow-600" : "text-red-600"
            )}
          >
            {variant.inventory > 0 
              ? `${variant.inventory} in stock` 
              : 'Out of Stock'}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>SKU: {variant.sku}</p>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className={cn("space-y-6", className)} aria-disabled={disabled}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Color Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Color</label>
          {selectedColor && (
            <Badge variant="secondary">{selectedColor}</Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {renderColorButtons()}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Size</label>
          {selectedSize && (
            <Badge variant="secondary">{selectedSize}</Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {renderSizeButtons()}
        </div>
      </div>

      {/* Variant Details */}
      {renderVariantDetails()}
    </div>
  );
};