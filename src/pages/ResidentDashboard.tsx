import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getComplaints, setComplaints, getUsers, getNextStaffId } from "@/data/mockData";
import { ComplaintType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

const STATUS_BADGE: Record<string, string> = {
  open: "bg-destructive/10 text-destructive",
  assigned: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
};

export default function ResidentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaintsState] = useState(getComplaints);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<ComplaintType>("normal");

  const myComplaints = complaints.filter(c => c.residentId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;
    const staffId = getNextStaffId();
    const users = getUsers();
    const staff = users.find(u => u.id === staffId);
    const newComplaint = {
      id: `c${Date.now()}`, title: title.trim(), description: desc.trim(), type, status: staffId ? "assigned" as const : "open" as const,
      residentId: user!.id, residentName: user!.name, flat: user!.flat || "",
      assignedStaffId: staffId || undefined, assignedStaffName: staff?.name || undefined,
      createdAt: new Date().toISOString(),
    };
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    setComplaintsState(updated);
    setTitle(""); setDesc(""); setType("normal");
    toast.success("Complaint submitted successfully");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Submit a Complaint</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief title" required />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={type} onValueChange={v => setType(v as ComplaintType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="anonymous">Anonymous</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the issue..." rows={3} required />
            </div>
            <Button type="submit"><PlusCircle className="w-4 h-4 mr-2" /> Submit Complaint</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">My Complaints ({myComplaints.length})</CardTitle></CardHeader>
        <CardContent>
          {myComplaints.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No complaints yet.</p>
          ) : (
            <div className="space-y-3">
              {myComplaints.map(c => (
                <div key={c.id} className="rounded-xl border border-border p-4 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="capitalize text-xs">{c.type}</Badge>
                      {c.assignedStaffName && <span>• Assigned to {c.assignedStaffName}</span>}
                    </div>
                  </div>
                  <Badge className={`capitalize text-xs shrink-0 ${STATUS_BADGE[c.status]}`}>{c.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
