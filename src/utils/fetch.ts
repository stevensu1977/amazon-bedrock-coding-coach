
'use client'


export const baseURL = process.env.NETX_PUBLIC_API_SERVER_URL || 'http://localhost:3000';

interface ChatMessage {
  question: string
  reply: string
}

export default async function fetchRequest(method: "GET"|"POST",url: string,  params: { [key: string]: any,history?:ChatMessage[]}  ) {
  
  // const localSettings = JSON.parse(localStorage.getItem('settings') as string);
  // const access_token=localStorage.getItem('accessToken');
  const access_token= "SK-123456789012"

  console.log(history)

  if (method==="POST"){
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify(params)
    });
    

    if (res.ok) {
      return res;
    }

    return Promise.reject(res.statusText);
  }
  
  return Promise.reject(`Not support ${method}`);
}


export  async function fetchRequestCode(method: "GET"|"POST",url: string,  params: { [key: string]: any}  ) {
  
  // const localSettings = JSON.parse(localStorage.getItem('settings') as string);
  // const access_token=localStorage.getItem('accessToken');
  const access_token= "SK-123456789012"

  if (method==="POST"){
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
      body: JSON.stringify(params)
    });
    

    if (res.ok) {
      return res;
    }

    return Promise.reject(res.statusText);
  }
  
  return Promise.reject(`Not support ${method}`);
}