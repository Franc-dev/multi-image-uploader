/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({
        message: "No file provided",
        status: 400,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'blog-images',
    });

    // Save to database
    const image = await prisma.image.create({
      data: {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
      },
    });

    return NextResponse.json({
      message: "Image uploaded successfully",
      status: 200,
      image,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({
      message: "An error occurred",
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      message: "Images retrieved successfully",
      status: 200,
      images,
    });
  } catch (error: any) {
    console.error("Fetch error:", error);
    return NextResponse.json({
      message: "An error occurred",
      status: 500,
    });
  }
}

