"use client";

import { useResponsive } from "@/hooks/responsive-context";
import { getUserAvatar, getCompanyAvatar } from "@/lib/dicebearAvatar";
import { useDashboardData } from "./modularDB/useDashboardData";
import DashboardHeader from "./modularDB/DashboardHeader";
import HeroSection from "./modularDB/HeroSection";
import StatsGrid from "./modularDB/StatsGrid";
import RecentJobsSection from "./modularDB/RecentJobsSection";
import ApplicantsSection from "./modularDB/ApplicantsSection";
import QuickActions from "./modularDB/QuickActions";
import LoadingSkeleton from "./modularDB/LoadingSkeleton";

export default function DashboardPage() {
  const { isMobile } = useResponsive();
  const {
    recentJobs,
    applicants,
    stats,
    loading,
    user,
    handleRefresh,
    formatCurrency,
    getStatusBadge,
    fetchDashboardData
  } = useDashboardData();

  // Loading skeleton
  // if (loading.jobs && loading.stats) {
  //   return <LoadingSkeleton />;
  // }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-6">
      {/* Header */}
      <DashboardHeader user={user} handleRefresh={handleRefresh} />

      {/* Hero Section */}
      <HeroSection stats={stats} user={user} />

      {/* Stats Grid */}
      <StatsGrid stats={stats} formatCurrency={formatCurrency} />

      {/* Recent Job Listings */}
      <RecentJobsSection
        recentJobs={recentJobs}
        loading={loading}
        getCompanyAvatar={getCompanyAvatar}
      />

      {/* Applicants/Applications section */}
      {(user?.role === "poster" || user?.role === "tasker") && (
        <ApplicantsSection
          user={user}
          applicants={applicants}
          loading={loading}
          getStatusBadge={getStatusBadge}
          getUserAvatar={getUserAvatar}
        />
      )}
    </div>
  );
}
