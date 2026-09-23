import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import DevicesPage from '@/pages/devices/DevicesPage';
import DeviceDetailPage from '@/pages/devices/DeviceDetailPage';
import OltsPage from '@/pages/olts/OltsPage';
import OltDetailPage from '@/pages/olts/OltDetailPage';
import OnusPage from '@/pages/onus/OnusPage';
import MikrotikPage from '@/pages/mikrotik/MikrotikPage';
import MikrotikDetailPage from '@/pages/mikrotik/MikrotikDetailPage';
import AlarmsPage from '@/pages/alarms/AlarmsPage';
import NetworkMapPage from '@/pages/map/NetworkMapPage';
import PopsPage from '@/pages/network/PopsPage';
import TopologyPage from '@/pages/network/TopologyPage';
import GenieDevicesPage from '@/pages/genieacs/GenieDevicesPage';
import UsersPage from '@/pages/users/UsersPage';
import RolesPage from '@/pages/system/RolesPage';
import NotificationsPage from '@/pages/system/NotificationsPage';
import AuditLogsPage from '@/pages/system/AuditLogsPage';
import SettingsPage from '@/pages/system/SettingsPage';
import ReportsPage from '@/pages/reports/ReportsPage';
import { useAuthStore } from '@/stores/auth.store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000, // 30 seconds
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />

            {/* Monitoring */}
            <Route path="devices" element={<DevicesPage />} />
            <Route path="devices/:id" element={<DeviceDetailPage />} />
            <Route path="olts" element={<OltsPage />} />
            <Route path="olts/:id" element={<OltDetailPage />} />
            <Route path="onus" element={<OnusPage />} />
            <Route path="mikrotik" element={<MikrotikPage />} />
            <Route path="mikrotik/:id" element={<MikrotikDetailPage />} />
            <Route path="alarms" element={<AlarmsPage />} />

            {/* Network */}
            <Route path="map" element={<NetworkMapPage />} />
            <Route path="pops" element={<PopsPage />} />
            <Route path="topology" element={<TopologyPage />} />

            {/* Integrations */}
            <Route path="genieacs" element={<GenieDevicesPage />} />

            {/* Reports */}
            <Route path="reports" element={<ReportsPage />} />

            {/* System */}
            <Route path="users" element={<UsersPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Catch-all */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
                  Page not found
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="system"
      />
    </QueryClientProvider>
  );
}

export default App;
