import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

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

    const notice = await db.collection("notices").findOne({
      _id: new ObjectId(id),
    });

    if (!notice) {
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
      data: {
        _id: notice._id.toString(),
        title: notice.title,
        description: notice.description,
        category: notice.category,
        noticeDate: notice.noticeDate || notice.createdAt,
        fileUrl: notice.fileUrl || "",
        fileType: notice.fileType || "",
        fileName: notice.fileName || "",
        createdBy: notice.createdBy || "",
        updatedBy: notice.updatedBy || "",
        createdAt: notice.createdAt,
        updatedAt: notice.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET /api/notices/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notice",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please login as admin.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid notice ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      category,
      noticeDate,
      fileUrl,
      fileType,
      fileName,
    } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, and category are required",
        },
        { status: 400 }
      );
    }

    const finalNoticeDate = noticeDate ? new Date(noticeDate) : new Date();

    const { db } = await connectToDatabase();

    const updatedNotice = {
      title,
      description,
      category,
      noticeDate: finalNoticeDate,
      fileUrl: fileUrl || "",
      fileType: fileType || "",
      fileName: fileName || "",
      updatedBy: session.user.email,
      updatedAt: new Date(),
    };

    const result = await db.collection("notices").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: updatedNotice,
      }
    );

    if (result.matchedCount === 0) {
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
      message: "Notice updated successfully",
      data: {
        _id: id,
        ...updatedNotice,
      },
    });
  } catch (error) {
    console.error("PUT /api/notices/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update notice",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please login as admin.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

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