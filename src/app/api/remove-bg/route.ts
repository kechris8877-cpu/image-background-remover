import { NextRequest, NextResponse } from "next/server";

const REMOVE_BG_API_URL = "https://api.remove.bg/v1.0/removebg";
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    if (!REMOVE_BG_API_KEY) {
      return NextResponse.json(
        { error: "API Key not configured", code: "CONFIG_ERROR" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image_file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided", code: "INVALID_FILE" },
        { status: 400 }
      );
    }

    // 验证文件类型
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, and WebP are supported", code: "INVALID_FILE" },
        { status: 400 }
      );
    }

    // 验证文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit", code: "INVALID_FILE" },
        { status: 400 }
      );
    }

    // 调用 remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append("image_file", file);
    removeBgFormData.append("size", "auto");

    const response = await fetch(REMOVE_BG_API_URL, {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 402) {
        return NextResponse.json(
          { error: "API limit exceeded. Please try again later.", code: "API_LIMIT" },
          { status: 429 }
        );
      }

      if (response.status === 400) {
        return NextResponse.json(
          { error: "Invalid image file", code: "INVALID_FILE" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Failed to process image. Please try again.", code: "NETWORK_ERROR" },
        { status: 500 }
      );
    }

    // 返回处理后的图片
    const imageBlob = await response.blob();
    
    return new NextResponse(imageBlob, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="removed-bg-${file.name.replace(/\.[^/.]+$/, "")}.png"`,
      },
    });

  } catch (error) {
    console.error("Remove.bg API error:", error);
    return NextResponse.json(
      { error: "Failed to process image. Please try again.", code: "NETWORK_ERROR" },
      { status: 500 }
    );
  }
}
