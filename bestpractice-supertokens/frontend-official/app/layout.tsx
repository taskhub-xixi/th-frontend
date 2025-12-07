/**
 * Root Layout
 *
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/setting-up-frontend
 */

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SuperTokensProvider } from "./components/supertokensProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskHub",
  description: "Task management with SuperTokens authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SuperTokensProvider>{children}</SuperTokensProvider>
      </body>
    </html>
  );
}
