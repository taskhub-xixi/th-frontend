import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function NotificationSettings({ notifications, setNotifications }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable Notifications</p>
            <p className="text-sm text-muted-foreground">
              Master switch for all notifications
            </p>
          </div>
          <Switch
            checked={notifications.notifications_enabled}
            onCheckedChange={(checked) =>
              setNotifications({
                ...notifications,
                notifications_enabled: checked,
              })
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">New Applications</p>
            <p className="text-sm text-muted-foreground">
              Get notified about new job applications
            </p>
          </div>
          <Switch
            checked={notifications.email_new_applications}
            onCheckedChange={(checked) =>
              setNotifications({
                ...notifications,
                email_new_applications: checked,
              })
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Job Updates</p>
            <p className="text-sm text-muted-foreground">
              Get notified about job status updates
            </p>
          </div>
          <Switch
            checked={notifications.email_job_updates}
            onCheckedChange={(checked) =>
              setNotifications({
                ...notifications,
                email_job_updates: checked,
              })
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Messages</p>
            <p className="text-sm text-muted-foreground">
              Get notified about new messages
            </p>
          </div>
          <Switch
            checked={notifications.email_messages}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, email_messages: checked })
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Reviews</p>
            <p className="text-sm text-muted-foreground">
              Get notified about new reviews
            </p>
          </div>
          <Switch
            checked={notifications.email_reviews}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, email_reviews: checked })
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-sm text-muted-foreground">
              Receive push notifications
            </p>
          </div>
          <Switch
            checked={notifications.push_notifications}
            onCheckedChange={(checked) =>
              setNotifications({
                ...notifications,
                push_notifications: checked,
              })
            }
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">SMS Notifications</p>
            <p className="text-sm text-muted-foreground">
              Receive SMS notifications (if enabled)
            </p>
          </div>
          <Switch
            checked={notifications.sms_notifications}
            onCheckedChange={(checked) =>
              setNotifications({
                ...notifications,
                sms_notifications: checked,
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}