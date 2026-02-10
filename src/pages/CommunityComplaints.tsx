import { useState } from "react";
import { getComplaints } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  open: "bg-destructive/10 text-destructive",
  assigned: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
};

export default function CommunityComplaints() {
  const [complaints] = useState(() => getComplaints().filter(c => c.type === "community"));

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4" /> Community Complaints</CardTitle></CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No community complaints yet.</p>
          ) : (
            <div className="space-y-3">
              {complaints.map(c => (
                <div key={c.id} className="rounded-xl border border-border p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                    <Badge className={`capitalize text-xs shrink-0 ${STATUS_BADGE[c.status]}`}>{c.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                  <p className="text-xs text-muted-foreground">Flat {c.flat} · {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
