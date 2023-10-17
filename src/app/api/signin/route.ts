
import { NextRequest,NextResponse } from 'next/server'
 
import expiredAt from "../../../utils/expirydate";


const admin =process.env.NEXT_PUBLIC_ADMIN||'admin';
const password =process.env.NEXT_PUBLIC_PASSWORD||'admin123';
const users=  JSON.parse(process.env.NEXT_PUBLIC_USERS||'{}');


console.log(users)

interface User{
    email: string
    password: string
}

export async function POST(req:NextRequest){
    
    
  const unauthRes=NextResponse.json({"status":"Bad Request"},{ status: 401 })
  console.log(admin,password,)
  try { 
    const user: User= await req.json()

    const currentUser = users.find((item) => user.email === item.email && user.password === item.password);

    if (currentUser) {
      const res=NextResponse.json({"status":"ok","user":user.email,"role":currentUser.role,"expiredAt":expiredAt(1)})
      res.cookies.set('auth',JSON.stringify({"user":user.email,"expiredAt":expiredAt(1)}))
      return res
    } else {
      return  unauthRes
    }

     
    // if (user.email== admin&&user.password==password){
    //   const res=NextResponse.json({"status":"ok","user":user.email,"expiredAt":expiredAt(1)})
    //   res.cookies.set('auth',JSON.stringify({"user":user.email,"expiredAt":expiredAt(1)}))
    //   return res
    // }
    // return  unauthRes
  } catch (error) {
    return  unauthRes
  }
  
  
  

  
}

