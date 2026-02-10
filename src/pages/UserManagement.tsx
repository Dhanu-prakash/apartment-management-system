import { useState } from "react";
import { getUsers, setUsers } from "@/data/mockData";
import { User, Role } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsersState] = useState(getUsers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("resident");
  const [flat, setFlat] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    if (role === "resident" && !flat.trim()) { toast.error("Flat number is required for residents"); return; }
    if (users.find(u => u.email === email)) { toast.error("Email already exists"); return; }
    const newUser: User = { id: `u${Date.now()}`, name: name.trim(), email: email.trim(), password, role, flat: role === "resident" ? flat.trim() : undefined };
    const updated = [...users, newUser];
    setUsers(updated);
    setUsersState(updated);
    setName(""); setEmail(""); setPassword(""); setFlat("");
    toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} added successfully`);
  };

  const ROLE_COLORS: Record<string, string> = { admin: "bg-primary/10 text-primary", staff: "bg-warning/10 text-warning", resident: "bg-success/10 text-success" };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><UserPlus className="w-4 h-4" /> Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@apt.com" required />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={v => setRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="resident">Resident</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === "resident" && (
              <div className="space-y-1.5">
                <Label>Flat Number</Label>
                <Input value={flat} onChange={e => setFlat(e.target.value)} placeholder="A-101" required />
              </div>
            )}
            <div className="flex items-end">
              <Button type="submit" className="w-full sm:w-auto"><UserPlus className="w-4 h-4 mr-2" /> Add User</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader><CardTitle className="text-base">All Users ({users.length})</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Flat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge className={`capitalize text-xs ${ROLE_COLORS[u.role]}`}>{u.role}</Badge></TableCell>
                  <TableCell>{u.flat || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
