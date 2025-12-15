"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Home, User, BriefcaseBusiness, MailSearch, Settings } from "lucide-react";
import Link from "next/link";
import { SidebarGroup } from "@/components/ui/sidebar";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";

export function NavMain() {
  const [isPoster, setIsPoster] = useState(true);

  return (
    <SidebarGroup>
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isPoster}
                  id="role-switch"
                  onCheckedChange={(value) => setIsPoster(value)}
                />
                <Label htmlFor="role-switch"> {isPoster ? "Poster" : "Tasker"}</Label>
              </div>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/dashboard">
                <Home />
                <span>Home</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/dashboard/profile">
                <User />
                <span>Profile</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/dashboard/jobs">
                <BriefcaseBusiness />
                <span>Jobs</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href="/dashboard/search-job">
                <MailSearch />
                Search Jobs
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem asChild>
              <Link href="/dashboard/setting">
                <Settings />
                Settings
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </SidebarGroup>
  );
}
