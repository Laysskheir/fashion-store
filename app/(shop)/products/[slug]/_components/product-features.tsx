import { Truck, Shield, Package, ArrowRight } from 'lucide-react';

export function ProductFeatures() {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border p-4">
      <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm">Free Shipping</span>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm">Secure Payment</span>
      </div>
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm">Easy Returns</span>
      </div>
      <div className="flex items-center gap-2">
        <ArrowRight className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm">Fast Delivery</span>
      </div>
    </div>
  );
}
