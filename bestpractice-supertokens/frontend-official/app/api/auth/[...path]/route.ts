/**
 * SuperTokens API Route Handler
 *
 * Handles all /api/auth/* endpoints
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/setting-up-backend
 */

import { getAppDirRequestHandler } from "supertokens-node/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { backendConfig } from "@/app/config/backend";
import SuperTokens from "supertokens-node";

// Initialize SuperTokens
SuperTokens.init(backendConfig());

const handleCall = getAppDirRequestHandler(NextRequest);

/**
 * GET handler
 */
export async function GET(request: NextRequest) {
  const res = await handleCall(request);
  if (!res.body) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }
  return res;
}

/**
 * POST handler
 */
export async function POST(request: NextRequest) {
  return handleCall(request);
}

/**
 * DELETE handler
 */
export async function DELETE(request: NextRequest) {
  return handleCall(request);
}

/**
 * PUT handler
 */
export async function PUT(request: NextRequest) {
  return handleCall(request);
}

/**
 * PATCH handler
 */
export async function PATCH(request: NextRequest) {
  return handleCall(request);
}

/**
 * HEAD handler
 */
export async function HEAD(request: NextRequest) {
  return handleCall(request);
}
