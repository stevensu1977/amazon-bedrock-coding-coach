'use client'


import {useEffect, useState} from 'react'
import { useSetRecoilState} from 'recoil'
import { useRouter } from 'next/navigation'
import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
} from '@chakra-ui/react'

import { authState } from "../../state"

interface User{
  email: string
  password: string
}

async function Post(user:User) {

  const response = await fetch('http://localhost:3000/api/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  const data = await response.json()
  return data
 
}

export default function SplitScreen() {
  const [user, setUser] = useState<User>({email:"",password:""})
  const [isAuth, setAuth] = useState(false)
  const router = useRouter()

  const setAuthState = useSetRecoilState(authState)
  
  useEffect(()=>{
    if(isAuth){
      router.push("/chat")
    }
    console.log(isAuth)

  },[isAuth])
  
 
  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Heading fontSize={'2xl'}>Sign in to your account</Heading>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={user.email} onChange={(e) => setUser(({...user,email:e.target.value}))} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" onChange={(e) => setUser(({...user,password:e.target.value}))} />
          </FormControl>
          <Stack spacing={6}>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}>
              <Checkbox>Remember me</Checkbox>
              <Text color={'blue.500'}>Forgot password?</Text>
            </Stack>
            <Button colorScheme={'blue'} variant={'solid'} onClick={()=>{
              console.log(user)
              Post(user).then((res)=>{
                if (res.status === "ok"){
                  setAuthState(res)
                  setAuth(true)
                
                }
              })
              
            }}>
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  )
}

// export default function Signup (){
//     const [name, setName] = useRecoilState(nameState)
    
//     return (
//        <div>
//            <h1>Signup {name} </h1>
//            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
//        </div>
//     )
// }