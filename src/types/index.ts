export type Role = "admin" | "staff" | "resident";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  flat?: string;
}

export type ComplaintType = "normal" | "anonymous" | "community";
export type ComplaintStatus = "open" | "assigned" | "resolved";

export interface Complaint {
  id: string;
  title: string;
  description: string;
  type: ComplaintType;
  status: ComplaintStatus;
  residentId: string;
  residentName: string;
  flat: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  resolvedAt?: string;
  rating?: number; // 1-5 star rating
  ratingComment?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postedByName: string;
  createdAt: string;
}

export interface Visitor {
  id: string;
  visitorName: string;
  flat: string;
  date: string;
  time: string;
  purpose: string;
  addedBy: string;
  entryTime?: string;
  exitTime?: string;
  phone?: string;
}

export interface MaintenanceAlert {
  location: string;
  issue: string;
  count: number;
  complaints: Complaint[];
}

export type EmergencyType = "fire" | "medical" | "security" | "other";

export interface EmergencyAlert {
  id: string;
  residentId: string;
  residentName: string;
  flat: string;
  message: string;
  type: EmergencyType;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedByName?: string;
  acknowledgedAt?: string;
}
