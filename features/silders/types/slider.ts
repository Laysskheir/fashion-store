// types/slider.ts
export interface HeroSlider {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  priority: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSliderInput {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
  priority?: number;
  tags?: string[];
}
