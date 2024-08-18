import { auth } from "@/auth"
import { NextResponse } from "next/server"
 
export const POST = auth(async function POST(req) {

  const formData = await req.formData();
  const title = formData.get('title') as string
  return Response.json(title)
  
  if (req.auth) return NextResponse.json(req.auth)
  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})