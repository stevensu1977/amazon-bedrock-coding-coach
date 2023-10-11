import { NextRequest,NextResponse} from 'next/server'
import piston from "piston-client";


const lanuages = {
    python:"3.10.0"
}

/**
 * POST handler for API route
 * 
 * @param {NextRequest} req - The request object
 */
export async function POST(req: NextRequest) {
    try {
      
      const {code,language}=await req.json()
      
      console.log(code,language)

      if (language!=="python"){
        const res=NextResponse.json({"status":"runtime not exits "},{status:500})
        return res
      }
      
      const stream = new TransformStream();
    
      const result= await (async () => {

        const client = piston({ server: "http://127.0.0.1:2000" });
        
        const runtimes = await client.runtimes();
        console.log(runtimes);
       
        const result = await client.execute({
          language: "python",version:"3.10.0"
        }, code);
        return result
    
    })();
      
    const res=NextResponse.json(result)
    return res
    } catch (error) {
        const res=NextResponse.json({"status":"error"},{status:500})
        return res
    }
  };
  