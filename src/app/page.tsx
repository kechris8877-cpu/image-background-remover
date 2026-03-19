"use client";

import { useState, useRef } from "react";
import { Upload, Download, RefreshCw, X, Image as ImageIcon, Loader2 } from "lucide-react";

type AppState = "upload" | "processing" | "result";

export default function Home() {
  const [state, setState] = useState<AppState>("upload");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    
    // 验证文件类型
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("只支持 JPG、PNG、WebP 格式的图片");
      return;
    }

    // 验证文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      setError("文件大小不能超过 10MB");
      return;
    }

    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalFile) return;

    setState("processing");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image_file", originalFile);

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "处理失败");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
      setState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理失败，请重试");
      setState("upload");
    }
  };

  const handleDownload = () => {
    if (!processedImage || !originalFile) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `removed-bg-${originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setState("upload");
    setOriginalImage(null);
    setProcessedImage(null);
    setOriginalFile(null);
    setError(null);
    setSliderPosition(50);
  };

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Image Background Remover
            </h1>
          </div>
          <span className="text-sm text-gray-600">Remove background instantly</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <X className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload State */}
        {state === "upload" && (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-blue-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">上传图片</h2>
            <p className="text-gray-600 mb-6">点击上传或拖拽图片到此处</p>
            <p className="text-sm text-gray-500 mb-6">支持 JPG、PNG、WebP 格式，最大 10MB</p>
            
            <button
              onClick={handleUploadClick}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              选择图片
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
            />

            {/* Preview selected image */}
            {originalImage && (
              <div className="mt-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-4">
                  <img
                    src={originalImage}
                    alt="Selected image"
                    className="w-full rounded"
                  />
                  <button
                    onClick={handleRemoveBackground}
                    className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    去除背景
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing State */}
        {state === "processing" && (
          <div className="text-center py-20">
            <div className="mb-6 flex justify-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">处理中...</h2>
            <p className="text-gray-600">正在去除图片背景，请稍候</p>
          </div>
        )}

        {/* Result State */}
        {state === "result" && (
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">处理结果</h2>
              
              {/* Before/After Comparison */}
              <div
                ref={containerRef}
                className="relative rounded-lg overflow-hidden select-none"
                style={{ cursor: "ew-resize" }}
                onMouseMove={handleSliderMove}
                onTouchMove={handleSliderMove}
                onMouseDown={() => document.body.style.userSelect = "none"}
                onMouseUp={() => document.body.style.userSelect = ""}
                onTouchStart={() => document.body.style.userSelect = "none"}
                onTouchEnd={() => document.body.style.userSelect = ""}
              >
                {/* Original Image (Background) */}
                <div className="relative">
                  {originalImage && (
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full rounded-lg"
                    />
                  )}
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                    Before
                  </div>
                </div>

                {/* Processed Image (Foreground) */}
                <div
                  className="absolute top-0 left-0 h-full overflow-hidden checkered-bg"
                  style={{ width: `${sliderPosition}%` }}
                >
                  {processedImage && (
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="h-full"
                      style={{ width: "100%", minWidth: "100%", objectFit: "cover" }}
                    />
                  )}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-blue-600/80 text-white text-sm rounded-full">
                    After
                  </div>
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-1 h-4 bg-gray-300 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  下载 PNG
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  重新上传
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Powered by <a href="https://www.remove.bg" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">remove.bg</a> API</p>
          <p className="mt-1">© 2024 Image Background Remover. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
