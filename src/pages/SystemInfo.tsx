import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Globe, Server, Monitor } from "lucide-react";

export default function SystemInfo() {
  const currentUrl = window.location.href;
  const hostname = window.location.hostname;
  const port = window.location.port;

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-primary" /> Local LAN-Based Residential System
          </CardTitle>
          <CardDescription>
            This application is designed to run on a local network (LAN) within the apartment complex.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" /> How It Works
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc ml-5">
              <li>The server is hosted on a computer within the apartment's local network (e.g., the admin office PC).</li>
              <li>All residents and staff connect to the same Wi-Fi or LAN network.</li>
              <li>Users access the application by entering the server's local IP address in their browser (e.g., <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">http://192.168.1.100:5173</code>).</li>
              <li>No internet connection or external data packets are required — everything stays within the local network.</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Current Access Info
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Current URL:</span>
                <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">{currentUrl}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Hostname:</span>
                <p className="font-mono text-xs bg-muted p-2 rounded mt-1">{hostname}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Port:</span>
                <p className="font-mono text-xs bg-muted p-2 rounded mt-1">{port || "default"}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-primary/5 space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" /> Benefits for Apartment Complexes
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">No Internet Needed</Badge>
              <Badge variant="secondary">Fast & Low Latency</Badge>
              <Badge variant="secondary">Data Privacy</Badge>
              <Badge variant="secondary">Cost Effective</Badge>
              <Badge variant="secondary">Easy Deployment</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Since data never leaves the local network, resident privacy is ensured. The system is ideal for apartment complexes
              where a central server can serve all connected devices without any recurring internet or hosting costs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
