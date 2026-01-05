import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  Clock,
  DollarSign,
  Filter,
  MapPin,
  Search,
  X,
} from "lucide-react";

// Filter options yang sesuai dengan DATA YANG ADA di database
const filterOptions = {
  category: [
    { value: "", label: "All Categories" },
    { value: "1", label: "Other" },
    { value: "2", label: "Business" },
    { value: "3", label: "Sales" },
    { value: "4", label: "Customer Support" },
    { value: "5", label: "Writing" },
    { value: "6", label: "Marketing" },
    { value: "7", label: "Product" },
    { value: "8", label: "Design" },
    { value: "9", label: "Engineering" },
  ],
  work_type: [
    { value: "", label: "All Work Types" },
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
  ],
  commitment: [
    { value: "", label: "All Commitments" },
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
  ],
  payment_type: [
    { value: "", label: "All Payment Types" },
    { value: "fixed", label: "Fixed Price" },
    { value: "hourly", label: "Hourly Rate" },
    { value: "project", label: "Project-based" },
    { value: "milestone", label: "Milestone-based" },
  ],
};

export default function JobSearchAndFilters({
  searchInput,
  setSearchInput,
  activeFilters,
  handleFilterSelect,
  handleLocationInput,
  handleBudgetFilter,
  clearFilters,
  hasActiveFilters,
  jobsCount,
  loading,
  sortBy,
  setSortBy,
  sortOptions
}) {
  // Get filter display value
  const getFilterDisplayValue = (key) => {
    const value = activeFilters[key];
    if (!value)
      return key === "category"
        ? "Category"
        : key === "work_type"
          ? "Work Type"
          : key === "commitment"
            ? "Commitment"
            : key === "payment_type"
              ? "Payment Type"
              : "Filter";

    const options = filterOptions[key];
    if (options) {
      const option = options.find((opt) => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search jobs by title, description, or skills..."
          className="pl-9 bg-background border-border text-sm"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Advanced Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filters:
          </span>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeFilters.category ? "default" : "outline"}
                size="sm"
                className="gap-2 border-border text-xs md:text-sm"
              >
                <Briefcase className="h-4 w-4" />
                {getFilterDisplayValue("category")}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {filterOptions.category.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleFilterSelect("category", option.value)}
                  className={
                    activeFilters.category === option.value ? "bg-accent" : ""
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Work Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeFilters.work_type ? "default" : "outline"}
                size="sm"
                className="gap-2 border-border text-xs md:text-sm"
              >
                <MapPin className="h-4 w-4" />
                {getFilterDisplayValue("work_type")}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {filterOptions.work_type.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() =>
                    handleFilterSelect("work_type", option.value)
                  }
                  className={
                    activeFilters.work_type === option.value
                      ? "bg-accent"
                      : ""
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Commitment Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeFilters.commitment ? "default" : "outline"}
                size="sm"
                className="gap-2 border-border text-xs md:text-sm"
              >
                <Clock className="h-4 w-4" />
                {getFilterDisplayValue("commitment")}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {filterOptions.commitment.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() =>
                    handleFilterSelect("commitment", option.value)
                  }
                  className={
                    activeFilters.commitment === option.value
                      ? "bg-accent"
                      : ""
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Location Input */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Location"
              className="pl-9 w-32 text-sm"
              value={activeFilters.location}
              onChange={(e) => handleLocationInput(e.target.value)}
            />
          </div>

          {/* Budget Range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Min"
                type="number"
                className="pl-9 w-24 text-sm"
                value={activeFilters.minBudget}
                onChange={(e) =>
                  handleBudgetFilter("minBudget", e.target.value)
                }
                min="0"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Max"
                type="number"
                className="pl-9 w-24 text-sm"
                value={activeFilters.maxBudget}
                onChange={(e) =>
                  handleBudgetFilter("maxBudget", e.target.value)
                }
                min="0"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-gray-500 text-xs md:text-sm"
              onClick={clearFilters}
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          )}

          <span className="text-xs md:text-sm text-gray-500 ml-auto">
            {loading ? "Loading..." : `${jobsCount} jobs found`}
          </span>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || value === "") return null;

            let displayValue = value;
            if (key === "category") {
              const option = filterOptions.category.find(
                (opt) => opt.value === value
              );
              displayValue = option ? option.label : value;
            } else if (key === "work_type") {
              const option = filterOptions.work_type.find(
                (opt) => opt.value === value
              );
              displayValue = option ? option.label : value;
            } else if (key === "commitment") {
              const option = filterOptions.commitment.find(
                (opt) => opt.value === value
              );
              displayValue = option ? option.label : value;
            } else if (key === "minBudget" || key === "maxBudget") {
              displayValue = `$${value}`;
            }

            return (
              <Badge key={key} variant="secondary" className="gap-1">
                {key}: {displayValue}
                <button
                  onClick={() => handleFilterSelect(key, "")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}