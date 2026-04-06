import { useState } from "react";
import { getComplaints, getVisitors, getUsers, getMaintenanceAlerts } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer, ClipboardList, UserCheck, Wrench, Star } from "lucide-react";

export default function Reports() {
  const complaints = getComplaints();
  const visitors = getVisitors();
  const users = getUsers();
  const maintenanceAlerts = getMaintenanceAlerts();
  const staffList = users.filter(u => u.role === "staff");

  const open = complaints.filter(c => c.status === "open").length;
  const assigned = complaints.filter(c => c.status === "assigned").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  const staffPerf = staffList.map(s => {
    const assigned = complaints.filter(c => c.assignedStaffId === s.id);
    const done = assigned.filter(c => c.status === "resolved");
    const ratings = done.filter(c => c.rating).map(c => c.rating!);
    const avg = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "N/A";
    return { name: s.name, total: assigned.length, resolved: done.length, avgRating: avg };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-xl font-semibold">Generate Reports</h2>
          <p className="text-sm text-muted-foreground">View and print summary reports</p>
        </div>
        <Button onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" /> Print Report
        </Button>
      </div>

      <Tabs defaultValue="complaints" className="no-print">
        <TabsList>
          <TabsTrigger value="complaints"><ClipboardList className="w-4 h-4 mr-1" /> Complaints</TabsTrigger>
          <TabsTrigger value="staff"><Star className="w-4 h-4 mr-1" /> Staff</TabsTrigger>
          <TabsTrigger value="visitors"><UserCheck className="w-4 h-4 mr-1" /> Visitors</TabsTrigger>
          <TabsTrigger value="maintenance"><Wrench className="w-4 h-4 mr-1" /> Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints">
          <ReportSection title="Complaint Summary Report">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <StatCard label="Total" value={complaints.length} />
              <StatCard label="Open" value={open} />
              <StatCard label="Assigned" value={assigned} />
              <StatCard label="Resolved" value={resolved} />
            </div>
            <h4 className="font-medium text-sm mb-2">By Type</h4>
            <div className="flex gap-3 mb-4">
              {(["normal", "anonymous", "community"] as const).map(t => (
                <Badge key={t} variant="secondary" className="capitalize">{t}: {complaints.filter(c => c.type === t).length}</Badge>
              ))}
            </div>
            <h4 className="font-medium text-sm mb-2">Recent Complaints</h4>
            <table className="w-full text-sm border">
              <thead><tr className="bg-muted"><th className="p-2 text-left">Title</th><th className="p-2">Flat</th><th className="p-2">Status</th><th className="p-2">Date</th></tr></thead>
              <tbody>
                {complaints.slice(0, 10).map(c => (
                  <tr key={c.id} className="border-t"><td className="p-2">{c.title}</td><td className="p-2 text-center">{c.flat}</td><td className="p-2 text-center capitalize">{c.status}</td><td className="p-2 text-center">{new Date(c.createdAt).toLocaleDateString()}</td></tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        </TabsContent>

        <TabsContent value="staff">
          <ReportSection title="Staff Performance Report">
            <table className="w-full text-sm border">
              <thead><tr className="bg-muted"><th className="p-2 text-left">Staff</th><th className="p-2">Assigned</th><th className="p-2">Resolved</th><th className="p-2">Avg Rating</th></tr></thead>
              <tbody>
                {staffPerf.map(s => (
                  <tr key={s.name} className="border-t"><td className="p-2">{s.name}</td><td className="p-2 text-center">{s.total}</td><td className="p-2 text-center">{s.resolved}</td><td className="p-2 text-center">{s.avgRating}</td></tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        </TabsContent>

        <TabsContent value="visitors">
          <ReportSection title="Visitor Log Report">
            <p className="text-sm text-muted-foreground mb-3">Total visitors recorded: {visitors.length}</p>
            <table className="w-full text-sm border">
              <thead><tr className="bg-muted"><th className="p-2 text-left">Visitor</th><th className="p-2">Flat</th><th className="p-2">Purpose</th><th className="p-2">Date</th><th className="p-2">Entry</th><th className="p-2">Exit</th></tr></thead>
              <tbody>
                {visitors.map(v => (
                  <tr key={v.id} className="border-t"><td className="p-2">{v.visitorName}</td><td className="p-2 text-center">{v.flat}</td><td className="p-2 text-center">{v.purpose}</td><td className="p-2 text-center">{v.date}</td><td className="p-2 text-center">{v.entryTime ? new Date(v.entryTime).toLocaleTimeString() : "-"}</td><td className="p-2 text-center">{v.exitTime ? new Date(v.exitTime).toLocaleTimeString() : "Still inside"}</td></tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        </TabsContent>

        <TabsContent value="maintenance">
          <ReportSection title="Maintenance Alerts Report">
            {maintenanceAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recurring issues detected.</p>
            ) : (
              <div className="space-y-3">
                {maintenanceAlerts.map((a, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="destructive">{a.count} reports</Badge>
                      <span className="font-medium text-sm">{a.issue} — {a.location}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Complaints: {a.complaints.map(c => c.title).join(", ")}</p>
                  </div>
                ))}
              </div>
            )}
          </ReportSection>
        </TabsContent>
      </Tabs>

      {/* Print-visible version of all reports */}
      <div className="hidden print:block space-y-6">
        <h2 className="text-xl font-bold">Apartment Management System — Full Report</h2>
        <p className="text-sm">Generated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="print-section">
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 rounded-lg border bg-muted/30 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
