import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useState } from "react";

interface ReminderSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: React.ElementType;
}

export const ReminderSettings = () => {
  const [settings, setSettings] = useState<ReminderSetting[]>([
    {
      id: "email_90",
      label: "90 Days Before",
      description: "Email reminder for upcoming expiry",
      enabled: true,
      icon: Mail,
    },
    {
      id: "email_60",
      label: "60 Days Before",
      description: "Email reminder with renewal checklist",
      enabled: true,
      icon: Mail,
    },
    {
      id: "email_30",
      label: "30 Days Before",
      description: "Urgent email reminder",
      enabled: true,
      icon: Mail,
    },
    {
      id: "sms",
      label: "SMS Alerts",
      description: "Text message reminders",
      enabled: false,
      icon: Smartphone,
    },
    {
      id: "whatsapp",
      label: "WhatsApp Alerts",
      description: "WhatsApp notifications",
      enabled: true,
      icon: MessageSquare,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Renewal Reminders</h3>
          <p className="text-sm text-muted-foreground">
            Configure how you want to be notified
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
          >
            <div className="flex items-center gap-3">
              <setting.icon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground text-sm">
                  {setting.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {setting.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting(setting.id)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                setting.enabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  setting.enabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <label className="block text-sm font-medium text-foreground mb-2">
          Primary Contact Email
        </label>
        <input
          type="email"
          defaultValue="admin@ngo.org"
          className="w-full input-dark"
        />
        <p className="text-xs text-muted-foreground mt-2">
          All compliance reminders will be sent to this email
        </p>
      </div>
    </div>
  );
};
