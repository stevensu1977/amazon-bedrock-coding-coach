
import { NextRequest,NextResponse } from 'next/server'
import { STS } from "@aws-sdk/client-sts";


const getCallerIdentity = async () => {
    try {
      const sts = new STS({ apiVersion: 'latest' });
      const response = await sts.getCallerIdentity({});
      return response.Arn ;
    } catch (error) {
      console.error('Error retrieving caller identity:', error);
    }
  };
  
export async function GET(req:NextRequest){
  
  const caller= await getCallerIdentity()
  const res=NextResponse.json({"me":caller})
  return res
}

