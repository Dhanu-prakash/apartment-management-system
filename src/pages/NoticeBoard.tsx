import { useState } from "react";
import { getNotices } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NoticeBoard() {
  const [notices] = useState(getNotices);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Notice Board</CardTitle></CardHeader>
        <CardContent>
          {notices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No notices yet.</p>
          ) : (
            <div className="space-y-4">
              {notices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(n => (
                <div key={n.id} className="rounded-xl border border-border p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">{n.title}</h3>
                  <p className="text-sm text-muted-foreground">{n.content}</p>
                  <p className="text-xs text-muted-foreground">Posted by {n.postedByName} · {new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
