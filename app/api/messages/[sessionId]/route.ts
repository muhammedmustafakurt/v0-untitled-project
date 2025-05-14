import { NextResponse } from "next/server";
import { getSessionDetails } from "@/lib/api"; // İsim değişti: getSessionMessages -> getSessionDetails

export async function POST( // GET değil, POST kullanıyoruz
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const sessionDetails = await getSessionDetails(sessionId); // Fonksiyon ismi güncellendi

    if (!sessionDetails) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Yanıtı API'nin formatına uygun şekilde döndürüyoruz
    return NextResponse.json({
      status: "success",
      result: {
        session: sessionDetails,
      },
      status_code: 200,
    });
  } catch (error) {
    console.error("Error fetching session details:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `Failed to fetch session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
