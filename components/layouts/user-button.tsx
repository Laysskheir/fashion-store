"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    UserIcon,
    ShoppingBag,
    Heart,
    Settings,
    Gift,
    Clock,
    CreditCard,
    Bell,
    LogOut,
    Truck,
    MapPin,
    Ticket,
    Tag
} from 'lucide-react';
import { User } from "better-auth/types";
import { cn } from "@/lib/utils";
import Link from 'next/link';

export default function UserProfile({ user, className }: { user: User; className?: string }) {
    const router = useRouter();
    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.refresh();
                },
                onError: (ctx) => {
                    alert(ctx.error.message);
                },
            },
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "relative border-l ring-0 rounded-none h-14 w-14 hidden md:flex shrink-0",
                        className
                    )}
                >
                    {user ? (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image ?? ''} alt={user.name ?? 'User avatar'} />
                            <AvatarFallback>{user.name?.[0] ?? 'U'}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <UserIcon className="h-6 w-6" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.name ?? 'Guest'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/orders')}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                    </DropdownMenuItem>

                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/payment-methods')}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Payment Methods</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/addresses')}>
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Shipping Addresses</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/track-orders')}>
                        <Truck className="mr-2 h-4 w-4" />
                        <span>Track Orders</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/notifications')}>
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notifications</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/coupons')}>
                        <Tag className="mr-2 h-4 w-4" />
                        <span>My Coupons</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/recently-viewed')}>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Recently Viewed</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/rewards')}>
                        <Gift className="mr-2 h-4 w-4" />
                        <span>Rewards</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />

                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}