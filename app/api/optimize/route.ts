import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    
    // Calculate target dimensions while maintaining aspect ratio
    const MAX_WIDTH = 1920;
    const MAX_HEIGHT = 1080;
    let width = metadata.width;
    let height = metadata.height;
    
    if (width && height) {
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      if (height > MAX_HEIGHT) {
        width = Math.round((width * MAX_HEIGHT) / height);
        height = MAX_HEIGHT;
      }
    }

    // Process image with sharp
    const optimizedBuffer = await sharp(buffer)
      .resize({
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ // Use WebP for better compression
        quality: 85, // Good balance between quality and size
        effort: 6, // Higher compression effort
        smartSubsample: true,
        nearLossless: true // Near-lossless compression
      })
      .toBuffer();

    // Log size reduction
    const originalSize = buffer.length;
    const optimizedSize = optimizedBuffer.length;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    console.log(`Original size: ${originalSize} bytes`);
    console.log(`Optimized size: ${optimizedSize} bytes`);
    console.log(`Size reduction: ${reduction}%`);

    // Convert optimized buffer to base64
    const base64Data = optimizedBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      optimizedImage: {
        data: base64Data,
        type: "image/webp",
        name: file.name.replace(/\.[^/.]+$/, "") + ".webp",
        originalSize,
        optimizedSize,
        reduction: `${reduction}%`
      }
    });
  } catch (error) {
    console.error("Image optimization error:", error);
    return NextResponse.json(
      { error: "Failed to optimize image" },
      { status: 500 }
    );
  }
}
