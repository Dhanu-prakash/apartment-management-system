import { useState } from "react";
import { getMaintenanceAlerts } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Wrench, MapPin, TrendingUp } from "lucide-react";

export default function PredictiveMaintenance() {
  const [alerts] = useState(getMaintenanceAlerts);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-warning/30 bg-warning/5">
        <CardContent className="pt-5 pb-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Predictive Maintenance Alerts</h3>
            <p className="text-xs text-muted-foreground mt-1">
              The system analyzes complaint patterns to identify recurring issues. Areas with multiple similar complaints may need preventive maintenance.
            </p>
          </div>
        </CardContent>
      </Card>

      {alerts.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-8 text-center">
            <Wrench className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No recurring patterns detected yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {alerts.map((alert, i) => (
            <Card key={i} className="shadow-sm border-l-4 border-l-warning">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-warning" />
                  {alert.issue} Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" /> {alert.location}
                  </span>
                  <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
                    {alert.count} complaints
                  </Badge>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
                  {alert.complaints.map(c => (
                    <div key={c.id} className="flex items-center justify-between text-xs">
                      <span className="text-foreground truncate mr-2">{c.title}</span>
                      <span className="text-muted-foreground shrink-0">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-destructive font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Recommended: Schedule preventive maintenance
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
