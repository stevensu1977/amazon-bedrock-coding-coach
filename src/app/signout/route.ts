
import { NextRequest,NextResponse } from 'next/server'
 

export async function GET(req:NextRequest){

  req.cookies.delete("auth");
  const response = NextResponse.redirect(new URL("/signin", req.url));
  response.cookies.delete("auth");
  return response
  
}

