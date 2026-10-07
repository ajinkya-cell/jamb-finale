import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SANITY_CACHE_TAG } from "@/sanity/fetch";

/**
 * Sanity webhook target: any publish revalidates every cached Sanity read.
 * Configure a webhook to POST here with SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true,
    );
    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    revalidateTag(SANITY_CACHE_TAG, "max");
    return NextResponse.json({ revalidated: SANITY_CACHE_TAG });
  } catch (err) {
    return new Response((err as Error).message, { status: 500 });
  }
}
