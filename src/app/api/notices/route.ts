import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@/auth";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const notices = await db
      .collection("notices")
      .find({})
      .sort({ noticeDate: -1, createdAt: -1 })
      .toArray();

    const formattedNotices = notices.map((notice) => ({
      _id: notice._id.toString(),
      title: notice.title,
      description: notice.description,
      category: notice.category,
      noticeDate: notice.noticeDate || notice.createdAt,
      fileUrl: notice.fileUrl || "",
      fileType: notice.fileType || "",
      fileName: notice.fileName || "",
      createdBy: notice.createdBy || "",
      createdAt: notice.createdAt,
      updatedAt: notice.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedNotices,
    });
  } catch (error) {
    console.error("GET /api/notices error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notices",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const { db } = await connectToDatabase();
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

    const newNotice = {
      title,
      description,
      category,
      noticeDate: finalNoticeDate,
      fileUrl: fileUrl || "",
      fileType: fileType || "",
      fileName: fileName || "",
      createdBy: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("notices").insertOne(newNotice);

    return NextResponse.json(
      {
        success: true,
        message: "Notice created successfully",
        data: {
          _id: result.insertedId.toString(),
          ...newNotice,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/notices error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create notice",
      },
      { status: 500 }
    );
  }
}