'use client'

import { Apple, CreditCard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function Payments() {
    return (
        <div className=" space-y-6">
            {/* Mobile Payments Section */}
            <Card className=" border-muted-foreground">
                <CardHeader>
                    <CardTitle className=" text-xl">Mobile Payments</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Connect your Apple Pay or Google Pay account to make payments easier.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Button
                        >
                            <Apple className="mr-2 h-5 w-5" />
                            Connect to Apple Pay
                        </Button>
                        <Button
                        >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Connect to Google Pay
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Credit Card Section */}
            <Card className="">
                <CardHeader>
                    <CardTitle className=" text-xl">Your Credit Card</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your credit card details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm">Name on card</label>
                            <Input
                                type="text"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm">Card number</label>
                            <Input
                                type="text"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm">Expiration date (MM/YY)</label>
                                <Input
                                    type="text"
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm">CVC</label>
                                <Input
                                    type="text"
                                />
                            </div>
                        </div>

                        <Button >
                            Save
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
