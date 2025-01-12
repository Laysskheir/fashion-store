'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { Address } from '@prisma/client';
import { ShippingFormData } from '@/types';
import { getCheckoutData } from '@/features/checkout/actions/get-checkout-data';
import { saveAddress } from '@/features/checkout/actions/save-address';
import { createOrder } from "@/features/checkout/actions/create-order";

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface CheckoutPageProps {
    initialData: Awaited<ReturnType<typeof getCheckoutData>>;
}

export default function CheckoutPage({ initialData }: CheckoutPageProps) {
    const router = useRouter();
    const { items, totalPrice } = useCart();
    const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
    const [addresses, setAddresses] = useState<Address[]>(initialData?.addresses || []);
    const [selectedAddressId, setSelectedAddressId] = useState<string>(initialData?.defaultAddress?.id || '');
    const [isNewAddress, setIsNewAddress] = useState(addresses.length === 0);
    const [shippingData, setShippingData] = useState<ShippingFormData>({
        firstName: initialData?.defaultAddress?.firstName || initialData?.user?.name?.split(' ')[0] || '',
        lastName: initialData?.defaultAddress?.lastName || initialData?.user?.name?.split(' ').slice(1).join(' ') || '',
        phone: initialData?.defaultAddress?.phone || '',
        address1: initialData?.defaultAddress?.address1 || '',
        address2: initialData?.defaultAddress?.address2 || '',
        city: initialData?.defaultAddress?.city || '',
        state: initialData?.defaultAddress?.state || '',
        postalCode: initialData?.defaultAddress?.postalCode || '',
        country: initialData?.defaultAddress?.country || 'SA',
        company: initialData?.defaultAddress?.company || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart');
        }
    }, [items.length, router]);

    if (items.length === 0) {
        return null;
    }

    const handleAddressSelect = (addressId: string) => {
        setSelectedAddressId(addressId);
        setIsNewAddress(false);
        const selectedAddress = addresses.find(addr => addr.id === addressId);
        if (selectedAddress) {
            setShippingData({
                ...shippingData,
                firstName: selectedAddress.firstName,
                lastName: selectedAddress.lastName,
                company: selectedAddress.company || '',
                address1: selectedAddress.address1,
                address2: selectedAddress.address2 || '',
                city: selectedAddress.city,
                state: selectedAddress.state,
                postalCode: selectedAddress.postalCode,
                country: selectedAddress.country,
                phone: selectedAddress.phone || '',
            });
        }
    };

    const handleShippingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isNewAddress) {
                const { error, address } = await saveAddress(shippingData);
                if (error) {
                    toast.error(error);
                    return;
                }
                if (address) {
                    setAddresses([...addresses, address]);
                    setSelectedAddressId(address.id);
                }
            }
            setCurrentStep('payment');
        } catch (error) {
            console.error('Error processing shipping information:', error);
            toast.error('Failed to process shipping information');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        {/* Progress Steps */}
                        <div className="flex items-center justify-between mb-8">
                            {['shipping', 'payment', 'review'].map((step, index) => (
                                <div key={step} className="flex items-center">
                                    <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${currentStep === step ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                  `}>
                                        {index + 1}
                                    </div>
                                    {index < 2 && (
                                        <div className="h-1 w-24 mx-2 bg-muted">
                                            <div className={`h-full bg-primary ${['shipping', 'payment', 'review'].indexOf(currentStep) > index ? 'w-full' : 'w-0'} transition-all duration-300`} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Shipping Form */}
                        {currentStep === 'shipping' && (
                            <form onSubmit={handleShippingSubmit} className="space-y-6">
                                <Card className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

                                    {addresses.length > 0 && (
                                        <div className="mb-6">
                                            <Label className="text-base">Select a shipping address</Label>
                                            <RadioGroup
                                                value={isNewAddress ? 'new' : selectedAddressId}
                                                onValueChange={(value) => {
                                                    if (value === 'new') {
                                                        setIsNewAddress(true);
                                                        setSelectedAddressId('');
                                                    } else {
                                                        handleAddressSelect(value);
                                                    }
                                                }}
                                                className="mt-3"
                                            >
                                                {addresses.map((address) => (
                                                    <div key={address.id} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={address.id} id={address.id} />
                                                        <Label htmlFor={address.id} className="flex-1 p-4 cursor-pointer">
                                                            <div className="font-medium">
                                                                {address.firstName} {address.lastName}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {address.address1}
                                                                {address.address2 && `, ${address.address2}`}
                                                                <br />
                                                                {address.city}, {address.state} {address.postalCode}
                                                                <br />
                                                                {countries.find(c => c.code === address.country)?.name}
                                                            </div>
                                                        </Label>
                                                    </div>
                                                ))}
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="new" id="new" />
                                                    <Label htmlFor="new" className="cursor-pointer">
                                                        Add a new address
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}

                                    {(isNewAddress || addresses.length === 0) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name *</Label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    value={shippingData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name *</Label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    value={shippingData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone *</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={shippingData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="company">Company (Optional)</Label>
                                                <Input
                                                    id="company"
                                                    name="company"
                                                    value={shippingData.company}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="address1">Address Line 1 *</Label>
                                                <Input
                                                    id="address1"
                                                    name="address1"
                                                    value={shippingData.address1}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                                                <Input
                                                    id="address2"
                                                    name="address2"
                                                    value={shippingData.address2}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City *</Label>
                                                <Input
                                                    id="city"
                                                    name="city"
                                                    value={shippingData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state">State/Province *</Label>
                                                <Input
                                                    id="state"
                                                    name="state"
                                                    value={shippingData.state}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="postalCode">Postal Code *</Label>
                                                <Input
                                                    id="postalCode"
                                                    name="postalCode"
                                                    value={shippingData.postalCode}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="country">Country *</Label>
                                                <Select
                                                    value={shippingData.country}
                                                    onValueChange={(value) => setShippingData(prev => ({ ...prev, country: value }))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a country" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {countries.map((country) => (
                                                            <SelectItem key={country.code} value={country.code}>
                                                                {country.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </Card>

                                <div className="flex justify-between items-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push('/cart')}
                                    >
                                        Back to Cart
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        Continue to Payment
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* Payment Form */}
                        {currentStep === 'payment' && (
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                                <div className="space-y-4">
                                    <RadioGroup
                                        defaultValue="cod"
                                        onValueChange={(value) => {
                                            // Handle payment method selection
                                            if (value === 'cod') {
                                                setCurrentStep('review');
                                            }
                                        }}
                                    >
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                            <RadioGroupItem value="cod" id="cod" />
                                            <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                                <div className="font-medium">Cash on Delivery</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Pay with cash when your order is delivered
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    <div className="mt-6 flex justify-between items-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep('shipping')}
                                        >
                                            Back to Shipping
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentStep('review')}
                                        >
                                            Continue to Review
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Order Review */}
                        {currentStep === 'review' && (
                            <Card className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
                                <div className="space-y-6">
                                    {/* Shipping Address */}
                                    <div>
                                        <h3 className="font-medium mb-2">Shipping Address</h3>
                                        <div className="text-sm text-muted-foreground">
                                            {shippingData.firstName} {shippingData.lastName}<br />
                                            {shippingData.address1}
                                            {shippingData.address2 && <><br />{shippingData.address2}</>}<br />
                                            {shippingData.city}, {shippingData.state} {shippingData.postalCode}<br />
                                            {countries.find(c => c.code === shippingData.country)?.name}<br />
                                            {shippingData.phone}
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <h3 className="font-medium mb-2">Payment Method</h3>
                                        <div className="text-sm text-muted-foreground">
                                            Cash on Delivery
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h3 className="font-medium mb-2">Order Items</h3>
                                        <div className="space-y-4">
                                            {items.map((item) => (
                                                <div key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`} className="flex gap-4">
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.product.name}</p>
                                                        {item.selectedVariant && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {item.selectedVariant.color && <span>Color: {item.selectedVariant.color}</span>}
                                                                {item.selectedVariant.size && <span className="ml-2">Size: {item.selectedVariant.size}</span>}
                                                            </div>
                                                        )}
                                                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-medium">
                                                        {formatPrice((item.selectedVariant?.price || item.product.price) * item.quantity)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-between items-center">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep('payment')}
                                        >
                                            Back to Payment
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={async () => {
                                                setIsLoading(true);
                                                try {
                                                    const orderData = {
                                                        items: items.map(item => ({
                                                            productId: item.product.id,
                                                            variantId: item.selectedVariant?.id,
                                                            quantity: item.quantity,
                                                            price: item.selectedVariant?.price || item.product.price,
                                                            name: item.product.name,
                                                        })),
                                                        addressId: selectedAddressId || '',
                                                        subtotal: totalPrice,
                                                        tax: 0, // You can implement tax calculation based on your needs
                                                        shipping: 0, // You can implement shipping calculation based on your needs
                                                        total: totalPrice,
                                                    };

                                                    const { error, order } = await createOrder(orderData);
                                                    
                                                    if (error) {
                                                        toast.error(error);
                                                        return;
                                                    }

                                                    toast.success('Order placed successfully!');
                                                    router.push('/orders');
                                                } catch (error) {
                                                    console.error('Error placing order:', error);
                                                    toast.error('Failed to place order');
                                                } finally {
                                                    setIsLoading(false);
                                                }
                                            }}
                                            disabled={isLoading}
                                        >
                                            Place Order
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`} className="flex gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product.name}</p>
                                        {item.selectedVariant && (
                                            <div className="text-sm text-muted-foreground">
                                                {item.selectedVariant.color && <span>Color: {item.selectedVariant.color}</span>}
                                                {item.selectedVariant.size && <span className="ml-2">Size: {item.selectedVariant.size}</span>}
                                            </div>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-medium">
                                        {formatPrice((item.selectedVariant?.price || item.product.price) * item.quantity)}
                                    </p>
                                </div>
                            ))}

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>Calculated at next step</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Tax</span>
                                    <span>Calculated at next step</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}