// types/settings.ts
export type StoreSettings = {
    id: string;
    storeName: string;
    storeUrl: string;
    description: string | null;
    logo: string | null;
    favicon: string | null;
    supportEmail: string;
    phoneNumber: string | null;
    businessAddress: string | null;
    openingHours: {
      start: string;
      end: string;
    };
    currency: string;
    language: string;
    timezone: string;
    appearance: {
      primaryColor: string;
      accentColor: string;
      headingFont: string;
      bodyFont: string;
      stickyHeader: boolean;
      showQuickView: boolean;
    };
    payment: {
      stripeEnabled: boolean;
      testMode: boolean;
      supportedCurrencies: string[];
      stripePublicKey?: string;
      stripeSecretKey?: string;
      webhookSecret?: string;
    };
    shipping: {
      freeShippingEnabled: boolean;
      minimumOrderAmount: number;
      shippingZones: string[];
    };
    email: {
      smtpServer: string;
      smtpUsername: string;
      smtpPassword: string;
      notifications: {
        orderConfirmation: boolean;
        shippingUpdates: boolean;
      };
    };
    advanced: {
      maintenanceMode: boolean;
      cacheDuration: number;
      apiKeys: string[];
    };
  }
  
  export type UpdateSettingsData = Partial<StoreSettings>;