import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ExistingNotice = {
  _id: ObjectId;
  title?: string;
  description?: string;
  category?: string;
  noticeDate?: Date;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  filePublicId?: string;
  fileResourceType?: string;
  filePreviewUrls?: string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

async function deleteCloudinaryFile(publicId?: string, resourceType?: string) {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
      invalidate: true,
    });
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
  }
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid notice ID.",
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const notice = await db.collection<ExistingNotice>("notices").findOne({
      _id: new ObjectId(id),
    });

    if (!notice) {
      return NextResponse.json(
        {
          success: false,
          message: "Notice not found.",
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
        filePublicId: notice.filePublicId || "",
        fileResourceType: notice.fileResourceType || "",
        filePreviewUrls: notice.filePreviewUrls || [],

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
        message: "Failed to fetch notice.",
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
          message: "Invalid notice ID.",
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
      filePublicId,
      fileResourceType,
      filePreviewUrls,
    } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, and category are required.",
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const existingNotice = await db.collection<ExistingNotice>("notices").findOne({
      _id: new ObjectId(id),
    });

    if (!existingNotice) {
      return NextResponse.json(
        {
          success: false,
          message: "Notice not found.",
        },
        { status: 404 }
      );
    }

    const oldPublicId = existingNotice.filePublicId || "";
    const newPublicId = filePublicId || "";

    const attachmentChanged = oldPublicId && oldPublicId !== newPublicId;

    const finalNoticeDate = noticeDate ? new Date(noticeDate) : new Date();

    const updatedNotice = {
      title,
      description,
      category,
      noticeDate: finalNoticeDate,

      fileUrl: fileUrl || "",
      fileType: fileType || "",
      fileName: fileName || "",
      filePublicId: filePublicId || "",
      fileResourceType: fileResourceType || "",
      filePreviewUrls: Array.isArray(filePreviewUrls) ? filePreviewUrls : [],

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
          message: "Notice not found.",
        },
        { status: 404 }
      );
    }

    if (attachmentChanged) {
      await deleteCloudinaryFile(
        existingNotice.filePublicId,
        existingNotice.fileResourceType
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notice updated successfully.",
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
        message: "Failed to update notice.",
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
          message: "Invalid notice ID.",
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const existingNotice = await db.collection<ExistingNotice>("notices").findOne({
      _id: new ObjectId(id),
    });

    if (!existingNotice) {
      return NextResponse.json(
        {
          success: false,
          message: "Notice not found.",
        },
        { status: 404 }
      );
    }

    const result = await db.collection("notices").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Notice not found.",
        },
        { status: 404 }
      );
    }

    await deleteCloudinaryFile(
      existingNotice.filePublicId,
      existingNotice.fileResourceType
    );

    return NextResponse.json({
      success: true,
      message: "Notice deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/notices/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete notice.",
      },
      { status: 500 }
    );
  }
}