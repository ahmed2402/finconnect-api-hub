
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
import { X, LayoutDashboard, GitGraph, Key, BarChart3, FileText, Settings } from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { title: 'API Catalog', icon: GitGraph, path: '/api-catalog' },
  { title: 'Transaction Simulator', icon: BarChart3, path: '/transaction-simulator' },
  { title: 'API Keys', icon: Key, path: '/api-keys' },
  { title: 'Analytics', icon: BarChart3, path: '/analytics' },
  { title: 'Documentation', icon: FileText, path: '/documentation' },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1 rounded">
            <GitGraph className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">FinConnect</span>
        </div>
        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
          <X className="w-5 h-5" />
        </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full"
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
