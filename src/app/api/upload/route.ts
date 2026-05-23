import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/auth";

export const runtime = "nodejs";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: string;
  original_filename?: string;
  format?: string;
  bytes?: number;
};

function getBaseFileName(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();
}

function getCloudinaryFolder(fileType: string) {
  if (fileType === "application/pdf") {
    return "LearningProjects/LearnNotices/PDF";
  }

  return "LearningProjects/LearnNotices/Images";
}

function getPublicId(fileName: string, fileType: string) {
  const baseName = getBaseFileName(fileName);
  const timestamp = Date.now();

  if (fileType === "application/pdf") {
    return `${timestamp}-${baseName}.pdf`;
  }

  return `${timestamp}-${baseName}`;
}

function uploadBufferToCloudinary(
  buffer: Buffer,
  fileName: string,
  fileType: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const isPdf = fileType === "application/pdf";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: getCloudinaryFolder(fileType),

        /*
          For PDF:
          - raw preserves the original file
          - public_id must include .pdf
          - delivery may still be blocked by Cloudinary security settings
        */
        resource_type: isPdf ? "raw" : "image",

        public_id: getPublicId(fileName, fileType),
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result as CloudinaryUploadResult);
      }
    );

    uploadStream.end(buffer);
  });
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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded.",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG, WEBP, and PDF files are allowed.",
        },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "File size must be less than 10MB.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await uploadBufferToCloudinary(
      buffer,
      file.name,
      file.type
    );

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully.",
      data: {
        fileUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        resourceType: uploaded.resource_type,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
    });
  } catch (error) {
    console.error("POST /api/upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload file.",
      },
      { status: 500 }
    );
  }
}