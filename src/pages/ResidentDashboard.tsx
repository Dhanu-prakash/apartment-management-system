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
import { PlusCircle, Star } from "lucide-react";
import { toast } from "sonner";

const STATUS_BADGE: Record<string, string> = {
  open: "bg-destructive/10 text-destructive",
  assigned: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
};

function RatingStars({ rating, onRate }: { rating: number; onRate: (r: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" onClick={() => onRate(s)} className="focus:outline-none">
          <Star className={`w-5 h-5 transition-colors ${s <= rating ? "text-warning fill-warning" : "text-muted-foreground/30 hover:text-warning/50"}`} />
        </button>
      ))}
    </div>
  );
}

export default function ResidentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaintsState] = useState(getComplaints);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<ComplaintType>("normal");
  const [ratingState, setRatingState] = useState<Record<string, { rating: number; comment: string }>>({});

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

  const handleRate = (complaintId: string) => {
    const rs = ratingState[complaintId];
    if (!rs || rs.rating === 0) return;
    const updated = complaints.map(c => c.id === complaintId ? { ...c, rating: rs.rating, ratingComment: rs.comment } : c);
    setComplaints(updated);
    setComplaintsState(updated);
    setRatingState(prev => { const n = { ...prev }; delete n[complaintId]; return n; });
    toast.success("Thank you for your feedback!");
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
                <div key={c.id} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
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

                  {/* Rating section for resolved complaints */}
                  {c.status === "resolved" && !c.rating && (
                    <div className="rounded-lg bg-muted/50 p-3 space-y-2 border border-border/50">
                      <p className="text-xs font-medium text-foreground">Rate this service ⭐</p>
                      <RatingStars
                        rating={ratingState[c.id]?.rating || 0}
                        onRate={r => setRatingState(prev => ({ ...prev, [c.id]: { ...prev[c.id], rating: r, comment: prev[c.id]?.comment || "" } }))}
                      />
                      <Input
                        placeholder="Optional feedback..."
                        className="text-xs h-8"
                        value={ratingState[c.id]?.comment || ""}
                        onChange={e => setRatingState(prev => ({ ...prev, [c.id]: { ...prev[c.id], rating: prev[c.id]?.rating || 0, comment: e.target.value } }))}
                      />
                      <Button size="sm" onClick={() => handleRate(c.id)} disabled={!ratingState[c.id]?.rating} className="text-xs">
                        Submit Rating
                      </Button>
                    </div>
                  )}

                  {c.rating && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Your rating:</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= c.rating! ? "text-warning fill-warning" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      {c.ratingComment && <span className="text-muted-foreground italic">"{c.ratingComment}"</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
