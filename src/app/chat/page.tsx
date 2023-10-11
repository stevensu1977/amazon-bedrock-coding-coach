"use client"

import { useEffect, useState, useRef } from 'react'
import { useRecoilState } from 'recoil';

import { chatMessagesState } from "../../state"

import {
  useColorMode,
  Alert,
  AlertIcon,
  Box,
  Flex,
  Icon,
  Input,
  IconButton,
  Stack,
  Spinner
} from '@chakra-ui/react'
import { FaRegCopy } from "react-icons/fa"
import { BsRobot } from "react-icons/bs";



import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'


import CleanMessages from "./CleanMessages"
import ExportMessages from "./ExportMessages"
import ExecuteCodeButton from "./ExecuteCode"

import fetchRequest from '../../utils/fetch';

interface ChatMessage {
  question: string
  reply: string
}

export const baseURL = process.env.NETX_PUBLIC_API_SERVER_URL || 'http://localhost:3000';


export default function Chat() {
  //const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messages, setMessages] = useRecoilState(chatMessagesState);

  const [isClient, setIsClient] = useState(false);
  const [showAlert, setShowAlert] = useState(false)
  const messagesEnd = useRef<HTMLDivElement>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const scrollToBottom = () => {

    if (messagesEnd && messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
      messagesEnd.current.scrollTop = messagesEnd.current.scrollHeight;
    }
  };

  const clearMessages=()=>{
    setMessages([])
  
  }

  useEffect(() => {
    console.log(colorMode)
    console.log(process.env.NEXT_PUBLIC_TITLE)
    setIsClient(true)
  }, [])

  const sendMessage = (message: string) => {

    setMessages([...messages, { question: message, reply: "" }])
    onReply(message);
  }

  const updateMessageList = (message: string,) => {

    setMessages((pre) => {
      return [
        ...pre.slice(0, -1),
        {
          ...pre.slice(-1)[0],
          reply: pre.slice(-1)[0].reply + message,
        }
      ];
    });

  };


  function CodeCopyBtn({ children }: any) {
    const [copyOk, setCopyOk] = useState(false);
    const iconColor = copyOk ? '#0af20a' : '#ddd';
    const icon = copyOk ? 'fa-check-square' : 'fa-copy';
    const handleClick = (e: any) => {
      navigator.clipboard.writeText(children.props.children);
      console.log(children.props.children)

      setCopyOk(true);
      setShowAlert(true);
      setTimeout(() => {
        setCopyOk(false);
        setShowAlert(false);
      }, 3000);

    }
    return (
      <div className="code-copy-btn"
        style={{
          top: "5px",
          right: "5px",
          position: "absolute",
        }}>
        
        <IconButton aria-label='Search database' icon={<FaRegCopy/>} onClick={handleClick} />
      </div>
    )
  }

 interface CodeExecuteBtnProps {
  children:any,
  language: string
 }

  function CodeExecuteBtn({ children, language }: CodeExecuteBtnProps) {
    const [copyOk, setCopyOk] = useState(false);
    const iconColor = copyOk ? '#0af20a' : '#ddd';
    const icon = copyOk ? 'fa-check-square' : 'fa-copy';
    const handleClick = (e: any) => {
      console.log(children,language)

      setCopyOk(true);
      
      setTimeout(() => {
        setCopyOk(false);
        setShowAlert(false);
      }, 3000);

    }
    return (
      <div className="code-copy-btn"
        style={{
          top: "5px",
          right: "60px",
          position: "absolute",
        }}>
        <ExecuteCodeButton language={language} code={children}/>
        
      </div>
    )
  }

  const Pre = ({ children }: any) => (<pre className="blog-pre"
    style={{
      position: "relative"
    }}>
    <CodeCopyBtn>{children}</CodeCopyBtn>
    {children}
  </pre>
  )

  const onReply = async (value: string) => {
    try {
      
      setAiThinking(true);
      
      let res: Response;
      let isMindmap: boolean = false;
      const history = messages.slice(-5)
      
      res = await fetchRequest("POST",`${baseURL}/api/bedrock/completion`, {
        query: value,
        history: history  
        
      }  );

      const reader = res?.body?.getReader() as ReadableStreamDefaultReader;

      const decoder = new TextDecoder();
      let done = false;
      let metaData: any;
      console.log(`isMindmap ${isMindmap}`)
      updateMessageList("")
      setAiThinking(false);
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        const hasMeta = chunkValue.includes('\n ###endjson### \n\n');
        if (hasMeta) {
          const [metaDataStr, message] = chunkValue.split('\n ###endjson### \n\n');
          metaData = JSON.parse(metaDataStr);
          updateMessageList(message.trim())
          console.log(metaData, message.trim());

        } else {
          console.log(chunkValue);
          updateMessageList(chunkValue)
        }
        scrollToBottom()
      }

    } catch (error) {
      setAiThinking(false);
      console.log(error);
      
    }
  };

  return (
    <Flex direction="column" h="85vh" align="center" overflow={"hidden"}>
      {showAlert && <Box ml="10%" w="30%">
        <Stack spacing={3} >
          <Alert status='success'>
            <AlertIcon />
            The code has been copied to the clipboard!
          </Alert>
        </Stack>
      </Box>
      }
      <Flex w="80%" h="75%" >
        <Box flexGrow={2} p={4} overflowY="auto"
          ref={messagesEnd}
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#CBD5E0',
              borderRadius: '24px',
            },
          }}
        >
          {isClient && messages.map((m, index) =>
            <Box key={index} pt="50px">
              <Flex alignContent={"right"} justifyContent={"right"}>
                <Box p='2' bg={isDark?"blue.400":"gray.100"} rounded={"8px"}>
                  {m.question}
                </Box>
                <Box p='2' >
                  You
                </Box>
              </Flex>
              <Box mt="20px">
                <Icon as={BsRobot} boxSize="24px" color={isDark?"blue.300":"blue.600"}/> {aiThinking&&<Spinner size='sm'/>}
              </Box>
              <Box ml="30px"  >
                <ReactMarkdown
                  children={m.reply}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: Pre,
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      console.log(`langusage ${match}`)
                      return match ? (
                        <>
                        {match[1]==="python"&&<CodeExecuteBtn language={match[1]} children={String(children).replace(/\n$/, '')}/>}
                        <SyntaxHighlighter
                          {...props}
                          children={String(children).replace(/\n$/, '')}
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                        />
                        </>

                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
                />
              </Box>
            </Box>

          )}
        </Box>
      </Flex>

      <Flex
        justifyContent={"center"}
        p={8}
      >
        <Input
          size="md"
          placeholder="Enter message"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              sendMessage(e.currentTarget.value)
              e.currentTarget.value = ''
            }
          }}
          w="70vw"
          ml={"20px"}
        />
      </Flex>
      <Box >
       <CleanMessages clearMessages={clearMessages}/>{'\u00A0'}{'\u00A0'}{'\u00A0'}
       <ExportMessages messages={messages}/>
      </Box>
    </Flex>
  )
}