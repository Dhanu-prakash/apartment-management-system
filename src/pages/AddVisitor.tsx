import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVisitors, setVisitors } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

export default function AddVisitor() {
  const { user } = useAuth();
  const [vName, setVName] = useState("");
  const [vFlat, setVFlat] = useState("");
  const [vDate, setVDate] = useState("");
  const [vTime, setVTime] = useState("");
  const [vPurpose, setVPurpose] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim() || !vFlat.trim() || !vDate || !vTime || !vPurpose.trim()) return;
    const visitors = getVisitors();
    const newV = { id: `v${Date.now()}`, visitorName: vName.trim(), flat: vFlat.trim(), date: vDate, time: vTime, purpose: vPurpose.trim(), addedBy: user!.id };
    setVisitors([newV, ...visitors]);
    setVName(""); setVFlat(""); setVDate(""); setVTime(""); setVPurpose("");
    toast.success("Visitor entry added");
  };

  return (
    <Card className="shadow-sm max-w-2xl">
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Add Visitor Entry</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Visitor Name</Label><Input value={vName} onChange={e => setVName(e.target.value)} placeholder="Visitor name" required /></div>
          <div className="space-y-1.5"><Label>Flat Number</Label><Input value={vFlat} onChange={e => setVFlat(e.target.value)} placeholder="A-101" required /></div>
          <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={vDate} onChange={e => setVDate(e.target.value)} required /></div>
          <div className="space-y-1.5"><Label>Time</Label><Input type="time" value={vTime} onChange={e => setVTime(e.target.value)} required /></div>
          <div className="sm:col-span-2 space-y-1.5"><Label>Purpose</Label><Input value={vPurpose} onChange={e => setVPurpose(e.target.value)} placeholder="Purpose of visit" required /></div>
          <div className="sm:col-span-2"><Button type="submit" className="w-full sm:w-auto"><PlusCircle className="w-4 h-4 mr-2" /> Add Entry</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
