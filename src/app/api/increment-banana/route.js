import { NextResponse } from "next/server";
import { incrementBananaCount } from "../../utils/bananaDB";

const isSingleHTMLBuild = process.env.SINGLE_HTML_BUILD === "true";
export const dynamic = isSingleHTMLBuild ? "force-static" : "force-dynamic";

export async function POST() {
  try {
    const count = await incrementBananaCount();
    return NextResponse.json(
      { count },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error incrementing banana count:", error);
    return NextResponse.json(
      { error: "Error incrementing banana count" },
      { status: 500 }
    );
  }
}
