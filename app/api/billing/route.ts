import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getUser, getAccessTokenRaw } = getKindeServerSession();

    const user = await getUser();
    const accessToken = await getAccessTokenRaw();

    if (!user || !accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.KINDE_ISSUER_URL}/account_api/v1/entitlements`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching entitlements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
