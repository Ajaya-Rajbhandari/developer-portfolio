import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const secret = process.env.REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const body = await req.json().catch(() => ({}));
    const provided = body?.secret || token;

    if (secret && provided !== secret) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const paths: string[] = body?.paths || ["/", "/projects"];

    paths.forEach((path) => revalidatePath(path));

    return NextResponse.json({ revalidated: true, paths });
  } catch (error) {
    console.error("Revalidate error", error);
    return NextResponse.json({ revalidated: false, error: "Failed to revalidate" }, { status: 500 });
  }
}
