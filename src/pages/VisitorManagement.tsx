import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVisitors, setVisitors, getUsers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck, PlusCircle } from "lucide-react";
import { toast } from "sonner";

export default function VisitorManagement() {
  const { user } = useAuth();
  const [visitors, setVisitorsState] = useState(getVisitors);
  const [vName, setVName] = useState("");
  const [vFlat, setVFlat] = useState("");
  const [vDate, setVDate] = useState("");
  const [vTime, setVTime] = useState("");
  const [vPurpose, setVPurpose] = useState("");

  const isStaff = user?.role === "staff";
  const isAdmin = user?.role === "admin";
  const isResident = user?.role === "resident";

  const displayVisitors = isResident ? visitors.filter(v => v.flat === user?.flat) : visitors;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim() || !vFlat.trim() || !vDate || !vTime || !vPurpose.trim()) return;
    const newV = { id: `v${Date.now()}`, visitorName: vName.trim(), flat: vFlat.trim(), date: vDate, time: vTime, purpose: vPurpose.trim(), addedBy: user!.id };
    const updated = [newV, ...visitors];
    setVisitors(updated);
    setVisitorsState(updated);
    setVName(""); setVFlat(""); setVDate(""); setVTime(""); setVPurpose("");
    toast.success("Visitor entry added");
  };

  return (
    <div className="space-y-6">
      {isStaff && (
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Add Visitor Entry</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>Visitor Name</Label><Input value={vName} onChange={e => setVName(e.target.value)} placeholder="Visitor name" required /></div>
              <div className="space-y-1.5"><Label>Flat Number</Label><Input value={vFlat} onChange={e => setVFlat(e.target.value)} placeholder="A-101" required /></div>
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={vDate} onChange={e => setVDate(e.target.value)} required /></div>
              <div className="space-y-1.5"><Label>Time</Label><Input type="time" value={vTime} onChange={e => setVTime(e.target.value)} required /></div>
              <div className="space-y-1.5"><Label>Purpose</Label><Input value={vPurpose} onChange={e => setVPurpose(e.target.value)} placeholder="Purpose of visit" required /></div>
              <div className="flex items-end"><Button type="submit"><PlusCircle className="w-4 h-4 mr-2" /> Add Entry</Button></div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><UserCheck className="w-4 h-4" /> {isResident ? "My Visitors" : "All Visitors"}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayVisitors.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No visitor records.</TableCell></TableRow>
              ) : displayVisitors.map(v => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.visitorName}</TableCell>
                  <TableCell>{v.flat}</TableCell>
                  <TableCell>{v.date}</TableCell>
                  <TableCell>{v.time}</TableCell>
                  <TableCell className="text-muted-foreground">{v.purpose}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
