/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
// import cloudinary from "@/lib/cloudinary";

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {

  try {
    const { id } = await props.params;

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
  //  await cloudinary.uploader.destroy(image.publicId);

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
