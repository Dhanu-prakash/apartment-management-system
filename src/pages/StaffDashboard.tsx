import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getComplaints, setComplaints, getNotices, setNotices } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Bell } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const STATUS_BADGE: Record<string, string> = {
  open: "bg-destructive/10 text-destructive",
  assigned: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
};

export default function StaffDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaintsState] = useState(getComplaints);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");

  const myComplaints = complaints.filter(c => c.assignedStaffId === user?.id);

  const handleResolve = (id: string) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status: "resolved" as const, resolvedAt: new Date().toISOString() } : c);
    setComplaints(updated);
    setComplaintsState(updated);
    toast.success("Complaint marked as resolved");
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    const notices = getNotices();
    const newNotice = { id: `n${Date.now()}`, title: noticeTitle.trim(), content: noticeContent.trim(), postedBy: user!.id, postedByName: user!.name, createdAt: new Date().toISOString() };
    setNotices([newNotice, ...notices]);
    setNoticeTitle(""); setNoticeContent("");
    toast.success("Notice posted successfully");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">My Assigned Complaints ({myComplaints.length})</CardTitle></CardHeader>
        <CardContent>
          {myComplaints.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No complaints assigned to you.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {myComplaints.map(c => (
                <div key={c.id} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                    <Badge className={`capitalize text-xs shrink-0 ${STATUS_BADGE[c.status]}`}>{c.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="capitalize text-xs">{c.type}</Badge>
                    {c.type !== "anonymous" && <span>• {c.residentName}</span>}
                    <span>• Flat {c.flat}</span>
                  </div>
                  {c.status !== "resolved" && (
                    <Button size="sm" onClick={() => handleResolve(c.id)} className="w-full mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Mark as Resolved
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Post a Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePostNotice} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} placeholder="Notice title" required />
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea value={noticeContent} onChange={e => setNoticeContent(e.target.value)} placeholder="Write your notice here..." rows={3} required />
            </div>
            <Button type="submit"><Bell className="w-4 h-4 mr-2" /> Post Notice</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
