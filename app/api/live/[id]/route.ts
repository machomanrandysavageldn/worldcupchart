import { NextResponse } from "next/server";
import { getAllMatches } from "@/lib/fixtures";
import { computeLiveState } from "@/lib/live";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const matches = await getAllMatches();
  const m = matches.find((x) => x.id === id);
  if (!m) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(computeLiveState(m));
}
