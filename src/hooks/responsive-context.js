"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";

const ResponsiveContext = React.createContext(undefined);

export const ResponsiveProvider = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <ResponsiveContext.Provider value={{ isMobile }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => {
  const context = React.useContext(ResponsiveContext);

  if (context === undefined) {
    throw new Error(
      "useResponsive must be used inside <ResponsiveProvider />"
    );
  }

  return context;
};
