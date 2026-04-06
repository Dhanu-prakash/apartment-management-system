import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getEmergencyAlerts, setEmergencyAlerts, getUsers } from "@/data/mockData";
import { EmergencyAlert, EmergencyType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Flame, Heart, Shield, HelpCircle, CheckCircle2 } from "lucide-react";

const TYPES: { value: EmergencyType; label: string; icon: typeof Flame; color: string }[] = [
  { value: "fire", label: "Fire", icon: Flame, color: "text-destructive" },
  { value: "medical", label: "Medical", icon: Heart, color: "text-destructive" },
  { value: "security", label: "Security", icon: Shield, color: "text-warning" },
  { value: "other", label: "Other", icon: HelpCircle, color: "text-muted-foreground" },
];

export default function EmergencyAlerts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(getEmergencyAlerts());
  const [selectedType, setSelectedType] = useState<EmergencyType>("security");
  const [message, setMessage] = useState("");

  if (!user) return null;

  const isResident = user.role === "resident";
  const myAlerts = isResident ? alerts.filter(a => a.residentId === user.id) : alerts;
  const activeAlerts = alerts.filter(a => !a.acknowledged);

  const triggerAlert = () => {
    const newAlert: EmergencyAlert = {
      id: `ea_${Date.now()}`,
      residentId: user.id,
      residentName: user.name,
      flat: user.flat || "N/A",
      message: message || `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} emergency`,
      type: selectedType,
      createdAt: new Date().toISOString(),
      acknowledged: false,
    };
    const updated = [newAlert, ...alerts];
    setAlerts(updated);
    setEmergencyAlerts(updated);
    setMessage("");
    toast({ title: "🚨 Emergency Alert Sent!", description: "Admin and staff have been notified.", variant: "destructive" });
  };

  const acknowledgeAlert = (id: string) => {
    const updated = alerts.map(a =>
      a.id === id ? { ...a, acknowledged: true, acknowledgedBy: user.id, acknowledgedByName: user.name, acknowledgedAt: new Date().toISOString() } : a
    );
    setAlerts(updated);
    setEmergencyAlerts(updated);
    toast({ title: "Alert acknowledged" });
  };

  const getTypeInfo = (type: EmergencyType) => TYPES.find(t => t.value === type) || TYPES[3];

  return (
    <div className="space-y-6">
      {isResident && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" /> Emergency Panic Button
            </CardTitle>
            <CardDescription>Use this in case of a real emergency. Admin and staff will be notified immediately.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(t => (
                <Button
                  key={t.value}
                  variant={selectedType === t.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(t.value)}
                  className={selectedType === t.value ? "" : ""}
                >
                  <t.icon className="w-4 h-4 mr-1" /> {t.label}
                </Button>
              ))}
            </div>
            <Textarea
              placeholder="Describe the emergency (optional)..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={2}
            />
            <Button variant="destructive" size="lg" className="w-full text-base font-semibold" onClick={triggerAlert}>
              <AlertTriangle className="w-5 h-5 mr-2" /> SEND EMERGENCY ALERT
            </Button>
          </CardContent>
        </Card>
      )}

      {!isResident && activeAlerts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5 animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> {activeAlerts.length} Active Emergency Alert{activeAlerts.length > 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isResident ? "My Alert History" : "All Emergency Alerts"}</CardTitle>
        </CardHeader>
        <CardContent>
          {myAlerts.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No emergency alerts.</p>
          ) : (
            <div className="space-y-3">
              {myAlerts.map(alert => {
                const info = getTypeInfo(alert.type);
                return (
                  <div
                    key={alert.id}
                    className={`flex items-start justify-between p-4 rounded-lg border ${!alert.acknowledged ? "border-destructive/40 bg-destructive/5" : "bg-muted/30"}`}
                  >
                    <div className="flex items-start gap-3">
                      <info.icon className={`w-5 h-5 mt-0.5 ${info.color}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{alert.residentName}</span>
                          <Badge variant="outline" className="text-xs">{alert.flat}</Badge>
                          <Badge variant={alert.acknowledged ? "secondary" : "destructive"} className="text-xs">
                            {alert.acknowledged ? "Acknowledged" : "Active"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.createdAt).toLocaleString()}
                          {alert.acknowledgedByName && ` • Acknowledged by ${alert.acknowledgedByName}`}
                        </p>
                      </div>
                    </div>
                    {!alert.acknowledged && !isResident && (
                      <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Acknowledge
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
