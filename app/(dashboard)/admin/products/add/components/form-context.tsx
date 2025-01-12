// form-context.tsx
import React, { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Category } from '@prisma/client';
import { ProductFormData } from './product-form/types';

type ProductFormContextType = {
  form: UseFormReturn<ProductFormData>;
  isEditing: boolean;
  categories: Category[];
  subcategories: Category[];
  product?: any;
};

const ProductFormContext = createContext<ProductFormContextType | undefined>(undefined);

export const ProductFormProvider: React.FC<
  ProductFormContextType & { children: React.ReactNode }
> = ({ 
  children, 
  form, 
  isEditing, 
  categories, 
  subcategories,
  product
}) => {
  return (
    <ProductFormContext.Provider 
      value={{ form, isEditing, categories, subcategories, product }}
    >
      {children}
    </ProductFormContext.Provider>
  );
};

export const useProductForm = () => {
  const context = useContext(ProductFormContext);
  if (!context) {
    throw new Error('useProductForm must be used within a ProductFormProvider');
  }
  return context;
};