import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CategoryFormData } from "../types";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  updateCategoryOrder,
} from "../actions/categories";

export const useCategory = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: CategoryFormData) => {
    try {
      setLoading(true);
      await createCategory(data);
      toast.success("Category created successfully");
      router.push("/admin/categories");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (categoryId: string, data: Partial<CategoryFormData>) => {
    try {
      setLoading(true);
      await updateCategory(categoryId, data);
      toast.success("Category updated successfully");
      router.push("/admin/categories");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      setLoading(true);
      await deleteCategory(categoryId);
      toast.success("Category deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (categoryId: string) => {
    try {
      setLoading(true);
      await toggleCategoryStatus(categoryId);
      toast.success("Category status updated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (categoryId: string, newOrder: number) => {
    try {
      setLoading(true);
      await updateCategoryOrder(categoryId, newOrder);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleStatus,
    handleReorder,
  };
};
