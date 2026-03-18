export default {
  async fetch(request, env, ctx) {
    const REMOVE_BG_API_URL = "https://api.remove.bg/v1.0/removebg";
    const API_KEY = env.REMOVE_BG_API_KEY;

    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: "API Key not configured", code: "CONFIG_ERROR" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const formData = await request.formData();
      const file = formData.get("image_file");

      if (!file) {
        return new Response(
          JSON.stringify({ error: "No file provided", code: "INVALID_FILE" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 验证文件类型
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: "Invalid file type. Only JPG, PNG, and WebP are supported", code: "INVALID_FILE" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 验证文件大小（10MB）
      if (file.size > 10 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: "File size exceeds 10MB limit", code: "INVALID_FILE" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 调用 remove.bg API
      const removeBgFormData = new FormData();
      removeBgFormData.append("image_file", file);
      removeBgFormData.append("size", "auto");

      const response = await fetch(REMOVE_BG_API_URL, {
        method: "POST",
        headers: {
          "X-Api-Key": API_KEY,
        },
        body: removeBgFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "API limit exceeded. Please try again later.", code: "API_LIMIT" }),
            { status: 429, headers: { "Content-Type": "application/json" } }
          );
        }

        if (response.status === 400) {
          return new Response(
            JSON.stringify({ error: "Invalid image file", code: "INVALID_FILE" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ error: "Failed to process image. Please try again.", code: "NETWORK_ERROR" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      // 返回处理后的图片
      const imageBlob = await response.blob();
      
      return new Response(imageBlob, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="removed-bg-${Date.now()}.png"`,
        },
      });

    } catch (error) {
      console.error("Remove.bg API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to process image. Please try again.", code: "NETWORK_ERROR" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
