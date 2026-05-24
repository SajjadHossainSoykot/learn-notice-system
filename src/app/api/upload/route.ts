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
  pages?: number;
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

function getPublicId(fileName: string) {
  const baseName = getBaseFileName(fileName);
  const timestamp = Date.now();

  return `${timestamp}-${baseName}`;
}

function buildPdfPreviewUrls(publicId: string, pageCount: number) {
  const safePageCount = Math.max(1, Math.min(pageCount || 1, 10));

  return Array.from({ length: safePageCount }, (_, index) => {
    const page = index + 1;

    return cloudinary.url(publicId, {
      secure: true,
      resource_type: "image",
      raw_transformation: `pg_${page},f_jpg,q_auto,w_1200,c_limit`,
    });
  });
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
          Important:
          PDF is uploaded as resource_type: "image"
          so Cloudinary can generate page previews using pg_1, pg_2, etc.
        */
        resource_type: "image",

        public_id: getPublicId(fileName),

        /*
          Keep original filename readable in Cloudinary.
        */
        filename_override: fileName,

        /*
          Do not auto-add random filename.
        */
        use_filename: false,

        /*
          For PDFs/images, this keeps format detection stable.
        */
        format: isPdf ? "pdf" : undefined,
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

    const isPdf = file.type === "application/pdf";

    const filePreviewUrls = isPdf
      ? buildPdfPreviewUrls(uploaded.public_id, uploaded.pages || 1)
      : [uploaded.secure_url];

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully.",
      data: {
        fileUrl: uploaded.secure_url,
        filePublicId: uploaded.public_id,
        fileResourceType: uploaded.resource_type,
        filePreviewUrls,
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