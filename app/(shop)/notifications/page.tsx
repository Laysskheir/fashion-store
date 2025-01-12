import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import NotificationsList from "./_components/notifications-list";
import NotificationSettings from "./_components/notification-settings";

export default function NotificationsPage() {
  return (
    <Container>
      <div className="py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage your notification preferences</p>
        </div>

        <Suspense fallback={<div>Loading notifications...</div>}>
          <NotificationsList />
        </Suspense>

        <Suspense fallback={<div>Loading settings...</div>}>
          <NotificationSettings />
        </Suspense>
      </div>
    </Container>
  );
}

