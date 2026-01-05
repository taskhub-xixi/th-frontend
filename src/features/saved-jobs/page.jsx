"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSavedJobs } from "./hooks/useSavedJobs";
import { SavedJobsHeader } from "./components/SavedJobsHeader";
import { SavedJobsList } from "./components/SavedJobsList";
import { SavedJobsEmpty } from "./components/SavedJobsEmpty";
// import { SavedJobsSkeleton } from "./components/SavedJobsSkeleton";
import { getCompanyAvatar } from "@/lib/dicebearAvatar";

export default function SavedJobs() {
  const { user } = useAuth();
  const {
    savedJobs,
    loading,
    error,
    fetchSavedJobs,
    handleRemoveSaved,
    handleToggleSave,
    getSortedJobs,
    formatBudget,
    formatDate,
    getSkills,
  } = useSavedJobs();

  const renderContent = () => {
    // if (loading) {
    //   return <SavedJobsSkeleton />;
    // }

    if (error) {
      return (
        <Card className="border-border">
          <CardContent className="p-6 md:p-8 text-center">
            <p className="text-red-500 mb-4 text-sm md:text-base">{error}</p>
            <Button onClick={fetchSavedJobs} size="sm">
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (savedJobs.length === 0) {
      return <SavedJobsEmpty />;
    }

    return (
      <SavedJobsList
        formatBudget={formatBudget}
        formatDate={formatDate}
        getSkills={getSkills}
        getCompanyAvatar={getCompanyAvatar}
        jobs={getSortedJobs()}
        onRemove={handleRemoveSaved}
        onToggleSave={handleToggleSave}
        user={user}
      />
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <SavedJobsHeader onRefresh={fetchSavedJobs} savedJobsCount={savedJobs.length} />
      {renderContent()}
    </div>
  );
}
