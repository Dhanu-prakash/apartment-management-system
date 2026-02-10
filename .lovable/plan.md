

# Apartment Management System

A modern, SaaS-style apartment management web app with role-based access for Admin, Staff, and Resident users. Uses mock authentication with hardcoded demo users and localStorage for data persistence — perfect for a college mini project demo.

---

## 1. Login Page
- Clean, centered login form with email and password fields
- Three demo accounts pre-configured (Admin, Staff, Resident) with credentials shown on the page for easy demo
- After login, redirect to the appropriate role-based dashboard
- Session stored in localStorage

## 2. App Layout
- **Left sidebar** with role-based navigation links (only shows pages relevant to the logged-in user's role)
- **Top bar** showing page title, user name, and a role badge (e.g., "Admin" in a colored chip)
- **Main content area** with card-based layouts and clean tables
- Logout button in sidebar
- Modern SaaS styling: light background, Inter font, subtle shadows, consistent spacing

## 3. Admin Dashboard
- **Overview cards**: Total complaints, Open, Assigned, Resolved counts
- **Complaints table**: Shows all complaints with type, status badge, assigned staff, and resident info (hidden for anonymous)
- **Staff workload section**: Cards or table showing each staff member and their active complaint count
- Admin **cannot** resolve complaints — no action buttons on complaints

## 4. User Management (Admin only)
- Form to add new users with name, email, password, and role (Staff or Resident) + flat number for residents
- Table listing all users with their role and details
- Simple and clearly separated tab/page

## 5. Staff Dashboard
- Shows only complaints assigned to the logged-in staff member
- Each complaint displayed as a card with details (title, description, type, status badge)
- "Mark as Resolved" button on each assigned complaint
- **Post Notice** section: form to create a new notice with title and content

## 6. Resident Dashboard
- **Submit Complaint** form: title, description, and type selector (Normal / Anonymous / Community)
- **My Complaints** section: list of own complaints with status badges
- **Community Complaints** feed: shared view of all community-type complaints
- **My Visitors** section: table of visitor entries for the resident's flat
- **Notice Board**: feed of notices posted by staff, newest first

## 7. Complaint Workflow
- When a resident submits a complaint, it starts as **Open**
- Auto-assigned to a staff member via round-robin, status becomes **Assigned**
- Staff marks it **Resolved**
- Anonymous complaints hide resident identity from all views
- Community complaints appear in the shared resident feed

## 8. Notice Board
- Staff can post notices (title + content + timestamp)
- All residents see notices in a clean card-based feed, newest first
- Notices visible on Resident Dashboard

## 9. Visitor Management
- Staff can add visitor entries: visitor name, flat number, date, time, purpose
- Residents see only visitors to their own flat
- Admin can view all visitor entries

## 10. Data & State Management
- All data (users, complaints, notices, visitors) stored in localStorage
- Pre-seeded with demo data (a few complaints, notices, visitors) for a realistic demo
- No backend needed — everything runs in the browser

