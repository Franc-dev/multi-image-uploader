/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

type Props = {
  params: Promise<{ id: string }> | { id: string };
}

export async function DELETE(req: Request, props: Props) {
  const params = await props.params;
  try {
    // Get the ID from params, handling both Promise and direct object cases
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({
        message: "Image not found",
        status: 404,
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Delete from database
    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Image deleted successfully",
      status: 200,
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({
      message: "An error occurred",
      status: 500,
    });
  }
}