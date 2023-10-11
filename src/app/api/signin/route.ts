
import { NextRequest,NextResponse } from 'next/server'
 
import expiredAt from "../../../utils/expirydate";


const admin =process.env.NEXT_PUBLIC_ADMIN||'admin';
const password =process.env.NEXT_PUBLIC_PASSWORD||'admin123';

interface User{
    email: string
    password: string
}

export async function POST(req:NextRequest){
    
    
  const unauthRes=NextResponse.json({"status":"Bad Request"},{ status: 401 })
  console.log(admin,password,)
  try { 
    const user: User= await req.json()
    if (user.email== admin&&user.password==password){
      const res=NextResponse.json({"status":"ok","user":user.email,"expiredAt":expiredAt(1)})
      res.cookies.set('auth',JSON.stringify({"user":user.email,"expiredAt":expiredAt(1)}))
      return res
    }
    return  unauthRes
  } catch (error) {
    return  unauthRes
  }
  
  
  

  
}

