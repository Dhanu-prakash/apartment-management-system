import { User, Complaint, Notice, Visitor } from "@/types";

export const SEED_USERS: User[] = [
  { id: "u1", name: "Priya Sharma", email: "admin@demo.com", password: "admin123", role: "admin" },
  { id: "u2", name: "Rahul Verma", email: "staff@demo.com", password: "staff123", role: "staff" },
  { id: "u3", name: "Anita Desai", email: "staff2@demo.com", password: "staff123", role: "staff" },
  { id: "u4", name: "Amit Kumar", email: "resident@demo.com", password: "resident123", role: "resident", flat: "A-101" },
  { id: "u5", name: "Sneha Patel", email: "resident2@demo.com", password: "resident123", role: "resident", flat: "B-205" },
];

export const SEED_COMPLAINTS: Complaint[] = [
  {
    id: "c1", title: "Water leakage in bathroom", description: "There is continuous water leakage from the ceiling of the bathroom.",
    type: "normal", status: "assigned", residentId: "u4", residentName: "Amit Kumar", flat: "A-101",
    assignedStaffId: "u2", assignedStaffName: "Rahul Verma", createdAt: "2026-02-08T10:30:00",
  },
  {
    id: "c2", title: "Elevator not working", description: "The elevator in Block B has been out of service for 2 days.",
    type: "community", status: "assigned", residentId: "u5", residentName: "Sneha Patel", flat: "B-205",
    assignedStaffId: "u3", assignedStaffName: "Anita Desai", createdAt: "2026-02-07T14:00:00",
  },
  {
    id: "c3", title: "Noise complaint", description: "Loud music from the neighboring flat every night.",
    type: "anonymous", status: "open", residentId: "u4", residentName: "Amit Kumar", flat: "A-101",
    createdAt: "2026-02-09T22:00:00",
  },
  {
    id: "c4", title: "Parking issue", description: "Someone is parking in my assigned spot regularly.",
    type: "normal", status: "resolved", residentId: "u5", residentName: "Sneha Patel", flat: "B-205",
    assignedStaffId: "u2", assignedStaffName: "Rahul Verma", createdAt: "2026-02-05T09:00:00", resolvedAt: "2026-02-06T11:00:00",
  },
];

export const SEED_NOTICES: Notice[] = [
  { id: "n1", title: "Water Tank Cleaning", content: "Water supply will be disrupted on Feb 12 from 10 AM to 2 PM for tank cleaning.", postedBy: "u2", postedByName: "Rahul Verma", createdAt: "2026-02-09T08:00:00" },
  { id: "n2", title: "Society Meeting", content: "Annual general meeting scheduled for Feb 15 at 6 PM in the community hall.", postedBy: "u3", postedByName: "Anita Desai", createdAt: "2026-02-08T12:00:00" },
];

export const SEED_VISITORS: Visitor[] = [
  { id: "v1", visitorName: "Ravi Mehta", flat: "A-101", date: "2026-02-09", time: "10:30", purpose: "Delivery", addedBy: "u2" },
  { id: "v2", visitorName: "Sunita Joshi", flat: "B-205", date: "2026-02-08", time: "14:00", purpose: "Guest", addedBy: "u3" },
  { id: "v3", visitorName: "Courier Service", flat: "A-101", date: "2026-02-07", time: "11:15", purpose: "Package delivery", addedBy: "u2" },
];

// LocalStorage helpers
const KEYS = { users: "ams_users", complaints: "ams_complaints", notices: "ams_notices", visitors: "ams_visitors", session: "ams_session", roundRobin: "ams_rr" };

function init<T>(key: string, seed: T[]): T[] {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

export function getUsers(): User[] { return init(KEYS.users, SEED_USERS); }
export function setUsers(u: User[]) { localStorage.setItem(KEYS.users, JSON.stringify(u)); }

export function getComplaints(): Complaint[] { return init(KEYS.complaints, SEED_COMPLAINTS); }
export function setComplaints(c: Complaint[]) { localStorage.setItem(KEYS.complaints, JSON.stringify(c)); }

export function getNotices(): Notice[] { return init(KEYS.notices, SEED_NOTICES); }
export function setNotices(n: Notice[]) { localStorage.setItem(KEYS.notices, JSON.stringify(n)); }

export function getVisitors(): Visitor[] { return init(KEYS.visitors, SEED_VISITORS); }
export function setVisitors(v: Visitor[]) { localStorage.setItem(KEYS.visitors, JSON.stringify(v)); }

export function getSession(): User | null {
  const s = localStorage.getItem(KEYS.session);
  return s ? JSON.parse(s) : null;
}
export function setSession(u: User | null) {
  if (u) localStorage.setItem(KEYS.session, JSON.stringify(u));
  else localStorage.removeItem(KEYS.session);
}

// Round-robin staff assignment
export function getNextStaffId(): string {
  const users = getUsers();
  const staffList = users.filter(u => u.role === "staff");
  if (staffList.length === 0) return "";
  const idx = parseInt(localStorage.getItem(KEYS.roundRobin) || "0", 10);
  const staff = staffList[idx % staffList.length];
  localStorage.setItem(KEYS.roundRobin, String((idx + 1) % staffList.length));
  return staff.id;
}
