// c:/Users/layss/Desktop/fashion/types/action-response.ts
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}