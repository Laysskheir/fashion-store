
import * as z from "zod";
import { formProductSchema } from "@/schemas";

export type ProductFormData = z.infer<typeof formProductSchema>;

export interface ImageType {
  url: string;
  file?: File;
  isDefault: boolean;
}

export interface VariantType {
  id?: string;
  name: string;
  price: string;
  comparePrice?: string;
  inventory: string;
  isActive: boolean;
}

export interface AttributeType {
  id?: string;
  name: string;
  value: string;
}

import { UseFormReturn } from "react-hook-form";

export interface FormComponentProps {
  form: UseFormReturn<ProductFormData>;
}
