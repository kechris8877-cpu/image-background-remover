import { MAX_FILE_SIZE, REMOVE_BG_API } from './constants.js';

export default {
  async fetch(request, env) {
    // 仅处理POST请求
    if (request.method !== 'POST') {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Image Background Remover</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            h1 { color: #2c3e50; }
            input[type="file"] { margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>图片背景移除工具</h1>
            <form action="/" method="POST" enctype="multipart/form-data">
              <input type="file" name="image" accept="image/*" required>
              <button type="submit">移除背景</button>
            </form>
          </div>
        </body>
        </html>`,
        {
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }

    try {
      // 解析multipart表单数据
      const formData = await request.formData();
      const imageFile = formData.get('image');
      
      if (!imageFile) {
        return new Response('请上传图片文件', { status: 400 });
      }

      // 检查文件大小
      if (imageFile.size > MAX_FILE_SIZE) {
        return new Response(`文件过大（最大支持 ${MAX_FILE_SIZE/1024/1024}MB）`, { status: 400 });
      }

      // 直接使用内存中的图片数据
      const imageBuffer = await imageFile.arrayBuffer();
      
      // 调用Remove.bg API
      const removeBgResponse = await fetch(REMOVE_BG_API, {
        method: 'POST',
        headers: {
          'X-Api-Key': env.REMOVE_BG_API_KEY
        },
        body: new Blob([imageBuffer], { type: imageFile.type })
      });

      if (!removeBgResponse.ok) {
        const error = await removeBgResponse.text();
        return new Response(`背景移除失败: ${error}`, { status: removeBgResponse.status });
      }

      // 直接返回处理后的图片（内存中处理）
      return new Response(removeBgResponse.body, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `inline; filename="background-removed.png"`
        }
      });
      
    } catch (error) {
      return new Response(`处理错误: ${error.message}`, { status: 500 });
    }
  }
}