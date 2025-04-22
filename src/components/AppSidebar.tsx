
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, Key, BarChart3, GitGraph, Settings } from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { title: 'API Catalog', icon: GitGraph, path: '/api-catalog' },
  { title: 'API Keys', icon: Key, path: '/api-keys' },
  { title: 'Analytics', icon: BarChart3, path: '/analytics' },
  { title: 'Documentation', icon: FileText, path: '/documentation' },
  { title: 'Settings', icon: Settings, path: '/settings' },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-1 rounded">
            <GitGraph className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">FinConnect</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.path)}
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
