"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const UsageCard = ({ usageData }) => {
  // Sample data structure
  const defaultData = [
    {
      id: 1,
      name: "Total Applications",
      value: "$1,250.50",
      status: "active",
    },
    {
      id: 2,
      name: "Jobs Posted",
      value: "12",
      status: "active",
    },
    {
      id: 3,
      name: "Profile Views",
      value: "342",
      status: "active",
    },
    {
      id: 4,
      name: "Messages Sent",
      value: "156",
      status: "inactive",
    },
    {
      id: 5,
      name: "Completed Jobs",
      value: "8",
      status: "active",
    },
    {
      id: 6,
      name: "Pending Payments",
      value: "$500.00",
      status: "pending",
    },
    {
      id: 7,
      name: "Active Contracts",
      value: "3",
      status: "active",
    },
    {
      id: 8,
      name: "Saved Jobs",
      value: "24",
      status: "inactive",
    },
  ];

  const data = usageData || defaultData;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "opacity-100";
      case "pending":
        return "opacity-60";
      case "inactive":
        return "opacity-40";
      default:
        return "opacity-100";
    }
  };

  const getProgressValue = (index) => {
    return ((index + 1) / data.length) * 100;
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Usage</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          5 days remaining in cycle
        </p>
      </CardHeader>

      <CardContent className="space-y-1">
        {data.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center justify-between py-2.5 transition-opacity duration-200 ${getStatusColor(item.status)}`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-2 h-2 rounded-full bg-neutral-500 flex-shrink-0"
                style={{
                  opacity: item.status === "active" ? 1 : 0.3,
                  backgroundColor:
                    item.status === "active"
                      ? "rgb(212, 212, 212)"
                      : "rgb(115, 115, 115)",
                }}
              />
              <span className="text-sm text-foreground truncate">
                {item.name}
              </span>
            </div>

            <span className="text-sm text-muted-foreground ml-2 flex-shrink-0">
              {item.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UsageCard;
