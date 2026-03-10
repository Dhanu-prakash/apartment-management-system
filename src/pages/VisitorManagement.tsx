import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVisitors, setVisitors } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck, PlusCircle, Clock, LogOut as LogOutIcon, Shield } from "lucide-react";
import { toast } from "sonner";

export default function VisitorManagement() {
  const { user } = useAuth();
  const [visitors, setVisitorsState] = useState(getVisitors);
  const [vName, setVName] = useState("");
  const [vFlat, setVFlat] = useState("");
  const [vDate, setVDate] = useState("");
  const [vTime, setVTime] = useState("");
  const [vPurpose, setVPurpose] = useState("");
  const [vPhone, setVPhone] = useState("");

  const isStaff = user?.role === "staff";
  const isResident = user?.role === "resident";

  const displayVisitors = isResident ? visitors.filter(v => v.flat === user?.flat) : visitors;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim() || !vFlat.trim() || !vDate || !vTime || !vPurpose.trim()) return;
    const entryTime = new Date(`${vDate}T${vTime}:00`).toISOString();
    const newV = {
      id: `v${Date.now()}`, visitorName: vName.trim(), flat: vFlat.trim(), date: vDate, time: vTime,
      purpose: vPurpose.trim(), addedBy: user!.id, entryTime, phone: vPhone.trim() || undefined,
    };
    const updated = [newV, ...visitors];
    setVisitors(updated);
    setVisitorsState(updated);
    setVName(""); setVFlat(""); setVDate(""); setVTime(""); setVPurpose(""); setVPhone("");
    toast.success("Visitor entry added");
  };

  const handleMarkExit = (id: string) => {
    const updated = visitors.map(v => v.id === id ? { ...v, exitTime: new Date().toISOString() } : v);
    setVisitors(updated);
    setVisitorsState(updated);
    toast.success("Visitor exit recorded");
  };

  const activeVisitors = displayVisitors.filter(v => v.entryTime && !v.exitTime);
  const pastVisitors = displayVisitors.filter(v => v.exitTime || !v.entryTime);

  return (
    <div className="space-y-6">
      {isStaff && (
        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Add Visitor Entry</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>Visitor Name</Label><Input value={vName} onChange={e => setVName(e.target.value)} placeholder="Visitor name" required /></div>
              <div className="space-y-1.5"><Label>Phone Number</Label><Input value={vPhone} onChange={e => setVPhone(e.target.value)} placeholder="9876543210" /></div>
              <div className="space-y-1.5"><Label>Flat Number</Label><Input value={vFlat} onChange={e => setVFlat(e.target.value)} placeholder="A-101" required /></div>
              <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={vDate} onChange={e => setVDate(e.target.value)} required /></div>
              <div className="space-y-1.5"><Label>Time</Label><Input type="time" value={vTime} onChange={e => setVTime(e.target.value)} required /></div>
              <div className="space-y-1.5"><Label>Purpose</Label><Input value={vPurpose} onChange={e => setVPurpose(e.target.value)} placeholder="Purpose of visit" required /></div>
              <div className="lg:col-span-3 sm:col-span-2"><Button type="submit"><PlusCircle className="w-4 h-4 mr-2" /> Add Entry</Button></div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeVisitors.length > 0 && (
        <Card className="shadow-sm border-success/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" /> Currently Inside ({activeVisitors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Flat</TableHead>
                  <TableHead>Entry Time</TableHead>
                  <TableHead>Purpose</TableHead>
                  {isStaff && <TableHead>Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeVisitors.map(v => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.visitorName}</TableCell>
                    <TableCell className="text-muted-foreground">{v.phone || "—"}</TableCell>
                    <TableCell>{v.flat}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-success text-xs">
                        <Clock className="w-3 h-3" />
                        {v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : v.time}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{v.purpose}</TableCell>
                    {isStaff && (
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleMarkExit(v.id)} className="text-xs">
                          <LogOutIcon className="w-3 h-3 mr-1" /> Mark Exit
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> {isResident ? "Visitor History" : "All Visitor Records"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Flat</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastVisitors.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-6">No visitor records.</TableCell></TableRow>
              ) : pastVisitors.map(v => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.visitorName}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{v.phone || "—"}</TableCell>
                  <TableCell>{v.flat}</TableCell>
                  <TableCell className="text-xs">{v.date}</TableCell>
                  <TableCell className="text-xs">{v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : v.time}</TableCell>
                  <TableCell className="text-xs">{v.exitTime ? new Date(v.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{v.purpose}</TableCell>
                  <TableCell>
                    {v.exitTime ? (
                      <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">Exited</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">Inside</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
