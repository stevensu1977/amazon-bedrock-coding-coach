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
  InputGroup,
  InputRightElement,
  Stack,
  Image,
} from '@chakra-ui/react'

import { authState } from "../../state"

interface User{
  email: string
  password: string
}


const baseURL = process.env.NETX_PUBLIC_API_SERVER_URL || 'http://localhost:3000';

async function Post(user:User) {

  const response = await fetch(`${baseURL}/api/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  const data = await response.json()
  return data
 
}

export default function SigninScreen() {
  const [user, setUser] = useState<User>({email:"",password:""})
  const [isAuth, setAuth] = useState(false)
  const [showPassword, setShowPassword] = useState(false); // New state variable

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
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
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
      <Flex flex={1} >
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

