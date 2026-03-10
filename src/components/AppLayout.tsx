import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, ClipboardList, Users, Bell, UserCheck, LogOut, Building2, Wrench, Star,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarFooter, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const NAV = {
  admin: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "All Complaints", url: "/complaints", icon: ClipboardList },
    { title: "User Management", url: "/users", icon: Users },
    { title: "Visitors", url: "/visitors", icon: UserCheck },
  ],
  staff: [
    { title: "My Complaints", url: "/dashboard", icon: ClipboardList },
    { title: "Post Notice", url: "/notices/post", icon: Bell },
    { title: "Add Visitor", url: "/visitors/add", icon: UserCheck },
  ],
  resident: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Complaints", url: "/complaints", icon: ClipboardList },
    { title: "Community", url: "/community", icon: Users },
    { title: "Notices", url: "/notices", icon: Bell },
    { title: "My Visitors", url: "/visitors", icon: UserCheck },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-primary/15 text-primary",
  staff: "bg-warning/15 text-warning",
  resident: "bg-success/15 text-success",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  const links = NAV[user.role];
  const pageTitle = links.find(l => l.url === location.pathname)?.title || "Dashboard";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r-0">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground">ApartmentMgr</span>
                <span className="text-xs text-sidebar-foreground/60">Management System</span>
              </div>
            </div>
          </SidebarHeader>
          <Separator className="bg-sidebar-border mx-2 w-auto" />
          <SidebarContent className="pt-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/50 text-[11px] uppercase tracking-wider">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                        <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-3">
            <div className="flex items-center gap-2.5 rounded-lg bg-sidebar-accent/50 p-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-primary/20 text-sidebar-primary text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-[11px] text-sidebar-foreground/50 truncate">{user.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent mt-1">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-card/80 backdrop-blur px-4 md:px-6 h-14">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="secondary" className={`capitalize text-xs ${ROLE_COLORS[user.role]}`}>{user.role}</Badge>
            </div>
          </header>
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
