import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const JobFilters = ({ onFilterChange, filters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (field, value) => {
    const updatedFilters = { ...localFilters, [field]: value };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: "",
      location: "",
      maxBudget: "",
      minBudget: "",
      search: "",
      sortBy: "created_at",
      sortOrder: "desc",
      status: "",
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            onChange={(e) => handleInputChange("search", e.target.value)}
            placeholder="Search by title or description..."
            value={localFilters.search || ""}
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Enter location..."
            value={localFilters.location || ""}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minBudget">Min Budget</Label>
            <Input
              id="minBudget"
              onChange={(e) => handleInputChange("minBudget", e.target.value)}
              placeholder="Min"
              type="number"
              value={localFilters.minBudget || ""}
            />
          </div>
          <div>
            <Label htmlFor="maxBudget">Max Budget</Label>
            <Input
              id="maxBudget"
              onChange={(e) => handleInputChange("maxBudget", e.target.value)}
              placeholder="Max"
              type="number"
              value={localFilters.maxBudget || ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => handleInputChange("category", value)}
              value={localFilters.category || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Web Development</SelectItem>
                <SelectItem value="2">Design</SelectItem>
                <SelectItem value="3">Writing</SelectItem>
                <SelectItem value="4">Marketing</SelectItem>
                <SelectItem value="5">Data Entry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => handleInputChange("status", value)}
              value={localFilters.status || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sortBy">Sort By</Label>
            <Select
              onValueChange={(value) => handleInputChange("sortBy", value)}
              value={localFilters.sortBy || "created_at"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Posted</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sortOrder">Order</Label>
            <Select
              onValueChange={(value) => handleInputChange("sortOrder", value)}
              value={localFilters.sortOrder || "desc"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1" onClick={handleReset} type="button" variant="outline">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFilters;
