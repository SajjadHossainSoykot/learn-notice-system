import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Notice ID is required",
        },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid notice ID",
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection("notices").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Notice not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/notices/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete notice",
      },
      { status: 500 }
    );
  }
}