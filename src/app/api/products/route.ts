import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const productSchema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().min(1).max(100),
  description: z.string().max(1000).optional().or(z.literal("")),
  quantityOnHand: z.coerce.number().int().min(0),
  costPrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  sellingPrice: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  lowStockThreshold: z.union([z.coerce.number().int().min(0), z.literal("")]).optional(),
});

function toDecimal(v: unknown) {
  if (v === "" || v === undefined || v === null) return null;
  return Number(v);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const parsed = productSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    const d = parsed.data;
    const created = await prisma.product.create({
      data: {
        organizationId: session.user.organizationId,
        name: d.name.trim(),
        sku: d.sku.trim(),
        description: d.description?.toString().trim() || null,
        quantityOnHand: d.quantityOnHand,
        costPrice: toDecimal(d.costPrice),
        sellingPrice: toDecimal(d.sellingPrice),
        lowStockThreshold:
          d.lowStockThreshold === "" || d.lowStockThreshold === undefined
            ? null
            : Number(d.lowStockThreshold),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
    //if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "SKU already exists in your organization" },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
