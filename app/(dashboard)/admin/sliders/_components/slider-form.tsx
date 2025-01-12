"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  CalendarIcon,
  ImageIcon,
  Link2Icon,
  Loader2,
  TagIcon,
  TextIcon,
  ClockIcon,
  X,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { HeroSlider } from "@prisma/client";
import { sliderSchema } from "@/schemas";
import { SliderImageUpload } from "./slider-image-upload";
import { updateSlider } from "@/features/silders/actions/update-silder";
import { createSlider } from "@/features/silders/actions/create-slider";

type SliderFormValues = z.infer<typeof sliderSchema>;

interface SliderFormProps {
  existingSlider?: HeroSlider;
  isEditing?: boolean;
}

export default function SliderForm({ existingSlider, isEditing }: SliderFormProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { startUpload } = useUploadThing("sliderImage");

  const form = useForm<SliderFormValues>({
    resolver: zodResolver(sliderSchema),
    defaultValues: {
      title: existingSlider?.title || "",
      subtitle: existingSlider?.subtitle || "",
      imageUrl: existingSlider?.imageUrl || "",
      linkUrl: existingSlider?.linkUrl || "",
      buttonText: existingSlider?.buttonText || "",
      isActive: existingSlider?.isActive ?? true,
      startDate: existingSlider?.startDate,
      endDate: existingSlider?.endDate,
      priority: existingSlider?.priority ?? 50,
      tags: existingSlider?.tags || [],
    },
  });

  async function onSubmit(values: SliderFormValues) {
    try {
      setIsSubmitting(true);
      
      // Handle image upload if there's a new file
      let finalImageUrl = values.imageUrl;
      if (selectedFile) {
        const uploadResult = await startUpload([selectedFile]);
        if (!uploadResult?.[0]?.url) {
          toast.error("Failed to upload image");
          return;
        }
        finalImageUrl = uploadResult[0].url;
      } else if (finalImageUrl === "pending-upload") {
        toast.error("Please select an image");
        return;
      }

      const finalValues = {
        ...values,
        imageUrl: finalImageUrl,
      };

      if (isEditing) {
        await updateSlider(existingSlider!.id, finalValues);
        toast.success("Slider updated successfully");
      } else {
        await createSlider(finalValues);
        toast.success("Slider created successfully");
      }
      
      router.push("/admin/sliders");
      router.refresh();
    } catch (error) {
      console.error("Slider submission error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    const newTags = currentTags.filter((tag) => tag !== tagToRemove);
    form.setValue("tags", newTags, { shouldValidate: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {isEditing ? "Edit Slider" : "Add New Slider"}
                </h2>
                <p className="text-muted-foreground">
                  {isEditing
                    ? "Edit an existing slider in your store"
                    : "Create a new slider in your store"}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="mt-0">Active</FormLabel>
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmitting} type="submit" className="gap-2">
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting
                    ? "Saving..."
                    : isEditing
                      ? "Update Slider"
                      : "Create Slider"}
                </Button>
              </div>
            </div>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <TextIcon className="h-4 w-4" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="links" className="flex items-center gap-2">
                  <Link2Icon className="h-4 w-4" />
                  Links
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className="flex items-center gap-2"
                >
                  <ClockIcon className="h-4 w-4" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="tags" className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  Tags
                </TabsTrigger>
              </TabsList>
              <div className="space-y-4">
                <TabsContent value="basic">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Slider Title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="subtitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subtitle</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Slider Subtitle"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  max={100}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                Higher number = higher priority
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="media">
                  <div className="grid grid-cols-1 gap-4">
                    <SliderImageUpload
                      form={form}
                      defaultImage={existingSlider?.imageUrl}
                      onFileSelect={setSelectedFile}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="links">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="linkUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="buttonText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Button Text</FormLabel>
                              <FormControl>
                                <Input placeholder="Learn More" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="schedule">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date() ||
                                      (form.getValues("endDate") &&
                                        date > form.getValues("endDate"))
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                The date when the slider becomes active.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date() ||
                                      (form.getValues("startDate") &&
                                        date < form.getValues("startDate"))
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>
                                The date when the slider becomes inactive.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="tags">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <FormLabel>Tags</FormLabel>
                          <div className="flex gap-2 mb-2">
                            <Input
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              placeholder="Add a tag"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addTag();
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addTag}
                            >
                              Add Tag
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {form.watch("tags")?.map((tag) => (
                              <div
                                key={tag}
                                className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md flex items-center gap-2 text-sm"
                              >
                                {tag}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTag(tag)}
                                  className="h-5 w-5 p-0 hover:bg-secondary-foreground/10 rounded-full"
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">Remove {tag}</span>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
         
          </div>
        </form>
      </Form>
    </div>
  );
}
