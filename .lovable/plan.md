

# Sprint 2 Features: Emergency Alerts, Reports & LAN Info

## Overview
Add three features from the backlog: a Panic Button alert system, a report generation page, and a LAN deployment info section.

---

## 1. Emergency Alert System (Panic Button) 🔐
**What**: Residents can trigger an emergency alert visible to Admin and Staff instantly.

- Add an `EmergencyAlert` type to `types/index.ts` with fields: id, residentId, residentName, flat, message, type (fire/medical/security/other), createdAt, acknowledged, acknowledgedBy
- Add seed data and localStorage helpers in `mockData.ts`
- Create `EmergencyAlerts.tsx` page:
  - **Resident view**: Large panic button + optional message + alert type selector. Shows history of their past alerts
  - **Admin/Staff view**: List of all alerts with status (active/acknowledged). Staff can acknowledge alerts. Active alerts highlighted in red
- Add a persistent emergency button in `AppLayout.tsx` sidebar for residents (red button, always visible)
- Add `/emergency` route and nav links for all roles

## 2. Generate Reports (Admin only) 📊
**What**: Admin can generate summary reports as downloadable content or printable views.

- Create `Reports.tsx` page with report options:
  - **Complaint Summary**: Total/open/assigned/resolved counts by date range, breakdown by type and block
  - **Staff Performance**: Resolution times, ratings per staff member
  - **Visitor Log**: Visitor entries filtered by date range
  - **Maintenance Alerts**: Current recurring issues summary
- Each report rendered as a styled printable card section
- "Print Report" button using `window.print()` with print-friendly CSS
- Add `/reports` route, nav link for Admin

## 3. Local LAN-Based Residential System ℹ️
**What**: An info card explaining the LAN deployment concept (for viva explanation).

- Add a small "System Info" or "Network" page accessible to Admin
- Shows explanation: the app is hosted on a local server, residents connect via the local IP address (e.g., `192.168.1.x:5173`), no internet data required
- Displays current `window.location.href` as a demo of the concept
- Add `/system-info` route for Admin nav

## Technical Changes

| File | Change |
|------|--------|
| `src/types/index.ts` | Add `EmergencyAlert` interface |
| `src/data/mockData.ts` | Add emergency alerts seed data + helpers |
| `src/pages/EmergencyAlerts.tsx` | New — panic button + alert list |
| `src/pages/Reports.tsx` | New — report generation page |
| `src/pages/SystemInfo.tsx` | New — LAN deployment info |
| `src/components/AppLayout.tsx` | Add nav links (Emergency for all, Reports + System Info for admin) |
| `src/App.tsx` | Add 3 new routes |
| `src/index.css` | Add print-friendly CSS media query |

