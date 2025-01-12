"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NotificationsProps {
    className?: string;
}

export function NotificationsButton({ className }: NotificationsProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("border-l ring-0 rounded-none h-14 w-14 hidden md:flex shrink-0", className)}
                >
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Open notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                align="end" 
                className="w-80 p-4"
            >
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {/* Mark all as read logic */}}
                        >
                            Mark all as read
                        </Button>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                            No new notifications
                        </div>
                        {/* Placeholder for future notification list */}
                        {/* {notifications.map((notification) => (
                            <NotificationItem 
                                key={notification.id} 
                                notification={notification} 
                            />
                        ))} */}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}