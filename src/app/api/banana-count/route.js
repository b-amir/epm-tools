import { NextResponse } from "next/server";
import { getBananaCount } from "../../utils/bananaDB";

const isSingleHTMLBuild = process.env.SINGLE_HTML_BUILD === "true";
export const dynamic = isSingleHTMLBuild ? "force-static" : "force-dynamic";

export async function GET() {
  try {
    const count = await getBananaCount();
    return NextResponse.json(
      { count },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching banana count:", error);
    return NextResponse.json(
      { error: "Error fetching banana count" },
      { status: 500 }
    );
  }
}
