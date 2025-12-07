/**
 * Session Utilities for Server-Side Rendering
 *
 * Based on: https://supertokens.com/docs/quickstart/integrations/nextjs/app-directory/protecting-route
 */

import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PreParsedRequest, CollectingResponse } from "supertokens-node/framework/custom";
import { HTTPMethod } from "supertokens-node/types";
import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";

/**
 * Get SSR session from cookies
 * Use this in Server Components to check if user is authenticated
 */
export async function getSSRSession() {
  const cookieStore = cookies();
  const headersList = headers();

  let baseRequest = new PreParsedRequest({
    method: "get" as HTTPMethod,
    url: "",
    query: {},
    headers: headersList as any,
    cookies: cookieStore as any,
    getFormBody: async () => ({}),
    getJSONBody: async () => ({}),
  });

  let baseResponse = new CollectingResponse();

  try {
    let session = await Session.getSession(baseRequest, baseResponse, {
      sessionRequired: false,
    });
    return session;
  } catch (err) {
    if (Session.Error.isErrorFromSuperTokens(err)) {
      return undefined;
    }
    throw err;
  }
}

/**
 * Higher-order function to protect API routes
 * Wrap your API route handlers with this
 */
export function withSession(handler: Function) {
  return async (req: NextRequest) => {
    let baseRequest = new PreParsedRequest({
      method: req.method as HTTPMethod,
      url: req.url,
      query: Object.fromEntries(new URL(req.url).searchParams.entries()),
      headers: req.headers as any,
      cookies: req.cookies as any,
      getFormBody: async () => req.formData(),
      getJSONBody: async () => req.json(),
    });

    let baseResponse = new CollectingResponse();

    try {
      let session = await Session.getSession(baseRequest, baseResponse, {
        sessionRequired: true,
      });

      // Call the original handler
      return await handler(req, session);
    } catch (err) {
      if (Session.Error.isErrorFromSuperTokens(err)) {
        return new NextResponse("Authentication required", { status: 401 });
      }
      throw err;
    }
  };
}
