import { useState } from "react";
import { getComplaints, getUsers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  open: "bg-destructive/10 text-destructive",
  assigned: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
};

export default function AdminDashboard() {
  const [complaints] = useState(getComplaints);
  const [users] = useState(getUsers);

  const total = complaints.length;
  const open = complaints.filter(c => c.status === "open").length;
  const assigned = complaints.filter(c => c.status === "assigned").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  const staffMembers = users.filter(u => u.role === "staff");
  const staffWorkload = staffMembers.map(s => ({
    ...s,
    active: complaints.filter(c => c.assignedStaffId === s.id && c.status !== "resolved").length,
    total: complaints.filter(c => c.assignedStaffId === s.id).length,
  }));

  const stats = [
    { label: "Total Complaints", value: total, icon: ClipboardList, color: "text-primary" },
    { label: "Open", value: open, icon: AlertCircle, color: "text-destructive" },
    { label: "Assigned", value: assigned, icon: Clock, color: "text-warning" },
    { label: "Resolved", value: resolved, icon: CheckCircle2, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-5 pb-4 flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-muted ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">All Complaints</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Resident</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize text-xs">{c.type}</Badge></TableCell>
                  <TableCell>{c.type === "anonymous" ? <span className="italic text-muted-foreground">Anonymous</span> : c.residentName}</TableCell>
                  <TableCell>{c.assignedStaffName || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell><Badge className={`capitalize text-xs ${STATUS_BADGE[c.status]}`}>{c.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">Staff Workload</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffWorkload.map(s => (
              <div key={s.id} className="rounded-xl border border-border p-4 flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm">{s.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.active} active · {s.total} total</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
