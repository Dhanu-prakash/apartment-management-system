import { useState } from "react";
import { getComplaints, getUsers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? "text-warning fill-warning" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export default function StaffPerformance() {
  const [complaints] = useState(getComplaints);
  const [users] = useState(getUsers);

  const staffMembers = users.filter(u => u.role === "staff");

  const staffStats = staffMembers.map(staff => {
    const assigned = complaints.filter(c => c.assignedStaffId === staff.id);
    const resolved = assigned.filter(c => c.status === "resolved");
    const rated = resolved.filter(c => c.rating !== undefined);
    const avgRating = rated.length > 0 ? rated.reduce((sum, c) => sum + (c.rating || 0), 0) / rated.length : 0;

    return {
      ...staff,
      totalAssigned: assigned.length,
      totalResolved: resolved.length,
      totalRated: rated.length,
      avgRating,
      ratings: rated.map(c => ({ id: c.id, title: c.title, rating: c.rating!, comment: c.ratingComment })),
    };
  });

  const overallRated = complaints.filter(c => c.rating !== undefined);
  const overallAvg = overallRated.length > 0 ? overallRated.reduce((s, c) => s + (c.rating || 0), 0) / overallRated.length : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-5 pb-4 flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-warning/10 text-warning">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{overallAvg.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-5 pb-4 flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success/10 text-success">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{overallRated.length}</p>
              <p className="text-xs text-muted-foreground">Total Ratings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-5 pb-4 flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{staffMembers.length}</p>
              <p className="text-xs text-muted-foreground">Staff Members</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {staffStats.map(staff => (
          <Card key={staff.id} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {staff.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-sm">{staff.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{staff.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <Badge variant="outline">{staff.totalAssigned} assigned</Badge>
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">{staff.totalResolved} resolved</Badge>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">{staff.totalRated} rated</Badge>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(staff.avgRating)} />
                <span className="text-sm font-semibold text-foreground">{staff.avgRating > 0 ? staff.avgRating.toFixed(1) : "N/A"}</span>
              </div>
              {staff.ratings.length > 0 && (
                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  {staff.ratings.map(r => (
                    <div key={r.id} className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground truncate mr-2">{r.title}</span>
                        <StarRating rating={r.rating} />
                      </div>
                      {r.comment && <p className="text-[11px] text-muted-foreground italic">"{r.comment}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
