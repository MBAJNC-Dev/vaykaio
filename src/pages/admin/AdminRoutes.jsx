import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Page Loader Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-coral border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Lazy Load All Admin Pages
const AdminDashboard = lazy(() => import('./AdminDashboard.jsx'));
const AdminUsersManagement = lazy(() => import('./AdminUsersManagement.jsx'));
const AdminLoginPage = lazy(() => import('./AdminLoginPage.jsx'));
const AdminSettingsPage = lazy(() => import('./AdminSettingsPage.jsx'));
const AdminActivityLog = lazy(() => import('./AdminActivityLog.jsx'));
const AdminReportsPage = lazy(() => import('./AdminReportsPage.jsx'));
const AdminTravelPlansManagement = lazy(() => import('./AdminTravelPlansManagement.jsx'));
const AdminBookingsManagement = lazy(() => import('./AdminBookingsManagement.jsx'));
const AdminExpensesManagement = lazy(() => import('./AdminExpensesManagement.jsx'));
const AdminGroupTravelsManagement = lazy(() => import('./AdminGroupTravelsManagement.jsx'));
const AdminFamilyTravelsManagement = lazy(() => import('./AdminFamilyTravelsManagement.jsx'));
const AdminSoloTravelsManagement = lazy(() => import('./AdminSoloTravelsManagement.jsx'));
const AdminNotificationCenter = lazy(() => import('./AdminNotificationCenter.jsx'));
const AdminEmailCampaigns = lazy(() => import('./AdminEmailCampaigns.jsx'));
const AdminSystemHealth = lazy(() => import('./AdminSystemHealth.jsx'));
const AdminPerformanceMonitoring = lazy(() => import('./AdminPerformanceMonitoring.jsx'));
const AdminSecurityManagement = lazy(() => import('./AdminSecurityManagement.jsx'));
const AdminUserRolesPermissions = lazy(() => import('./AdminUserRolesPermissions.jsx'));
const AdminAuditTrail = lazy(() => import('./AdminAuditTrail.jsx'));
const AdminDatabaseManagement = lazy(() => import('./AdminDatabaseManagement.jsx'));
const AdminBackupRestore = lazy(() => import('./AdminBackupRestore.jsx'));
const AdminDataImport = lazy(() => import('./AdminDataImport.jsx'));
const AdminDataExport = lazy(() => import('./AdminDataExport.jsx'));
const AdminIntegrationManagement = lazy(() => import('./AdminIntegrationManagement.jsx'));
const AdminAPIManagement = lazy(() => import('./AdminAPIManagement.jsx'));
const AdminWebhookManagement = lazy(() => import('./AdminWebhookManagement.jsx'));
const AdminUserImpersonation = lazy(() => import('./AdminUserImpersonation.jsx'));
const AdminBulkOperations = lazy(() => import('./AdminBulkOperations.jsx'));
const AdminAdvancedSearch = lazy(() => import('./AdminAdvancedSearch.jsx'));
const AdminCustomReports = lazy(() => import('./AdminCustomReports.jsx'));
const AdminUserBehaviorAnalytics = lazy(() => import('./AdminUserBehaviorAnalytics.jsx'));
const AdminAnomalyDetection = lazy(() => import('./AdminAnomalyDetection.jsx'));
const AdminUserSegmentation = lazy(() => import('./AdminUserSegmentation.jsx'));
const AdminComplianceManagement = lazy(() => import('./AdminComplianceManagement.jsx'));
const AdminScheduledTasks = lazy(() => import('./AdminScheduledTasks.jsx'));
const AdminMessagesManagement = lazy(() => import('./AdminMessagesManagement.jsx'));

/**
 * AdminRoutes Component
 * Defines all admin dashboard routes and sub-pages
 * Used by AdminLayout via Outlet
 */
export default function AdminRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Main Dashboard */}
        <Route index element={<AdminDashboard />} />

        {/* User Management */}
        <Route path="users" element={<AdminUsersManagement />} />
        <Route path="users/roles-permissions" element={<AdminUserRolesPermissions />} />
        <Route path="users/impersonation" element={<AdminUserImpersonation />} />
        <Route path="users/segmentation" element={<AdminUserSegmentation />} />

        {/* Travel Management */}
        <Route path="travel-plans" element={<AdminTravelPlansManagement />} />
        <Route path="travel-plans/group" element={<AdminGroupTravelsManagement />} />
        <Route path="travel-plans/family" element={<AdminFamilyTravelsManagement />} />
        <Route path="travel-plans/solo" element={<AdminSoloTravelsManagement />} />

        {/* Booking & Expense Management */}
        <Route path="bookings" element={<AdminBookingsManagement />} />
        <Route path="expenses" element={<AdminExpensesManagement />} />

        {/* Notifications & Communications */}
        <Route path="notifications" element={<AdminNotificationCenter />} />
        <Route path="email-campaigns" element={<AdminEmailCampaigns />} />
        <Route path="messages" element={<AdminMessagesManagement />} />

        {/* System & Performance */}
        <Route path="system-health" element={<AdminSystemHealth />} />
        <Route path="performance" element={<AdminPerformanceMonitoring />} />
        <Route path="security" element={<AdminSecurityManagement />} />
        <Route path="audit-trail" element={<AdminAuditTrail />} />
        <Route path="activity-log" element={<AdminActivityLog />} />

        {/* Data Management */}
        <Route path="database" element={<AdminDatabaseManagement />} />
        <Route path="backup-restore" element={<AdminBackupRestore />} />
        <Route path="data-import" element={<AdminDataImport />} />
        <Route path="data-export" element={<AdminDataExport />} />

        {/* Integrations & APIs */}
        <Route path="integrations" element={<AdminIntegrationManagement />} />
        <Route path="api-management" element={<AdminAPIManagement />} />
        <Route path="webhooks" element={<AdminWebhookManagement />} />

        {/* Analytics & Reports */}
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="reports/custom" element={<AdminCustomReports />} />
        <Route path="analytics/user-behavior" element={<AdminUserBehaviorAnalytics />} />
        <Route path="analytics/anomaly-detection" element={<AdminAnomalyDetection />} />

        {/* Operations */}
        <Route path="bulk-operations" element={<AdminBulkOperations />} />
        <Route path="advanced-search" element={<AdminAdvancedSearch />} />
        <Route path="scheduled-tasks" element={<AdminScheduledTasks />} />
        <Route path="compliance" element={<AdminComplianceManagement />} />

        {/* Settings */}
        <Route path="settings" element={<AdminSettingsPage />} />

        {/* Auth */}
        <Route path="login" element={<AdminLoginPage />} />
      </Routes>
    </Suspense>
  );
}
