'use client'

import { useEffect, useState,useRef } from "react";
import { IconButton,Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";

import { MdOutlineFileDownload } from "react-icons/md";

interface ChatMessage {
    question: string
    reply: string
  }

  interface ExportMessagesProps {
    messages: ChatMessage[];
  }



const ExportMessages = ({messages}:ExportMessagesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient,setIsClient] = useState(false)
  
 
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onExport = () => {
    console.log("Export");
    exportJson(messages, "messages.json")
    onClose();
  
  }
  const exportJson = (data: ChatMessage[], fileName: string) => {
    
      const jsonData = JSON.stringify(data);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
  
      link.href = url;
      link.download = fileName;
      link.click();
  
      URL.revokeObjectURL(url);
    }
  
  

  useEffect(() => {
    setIsClient(true)
 },[])

  return (
    <>
    <IconButton
            right={4}
            icon={ <MdOutlineFileDownload/>}
            aria-label="Toggle Theme"
            colorScheme="green"
            onClick={() => setIsOpen(true)}
            />

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirmation</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to export this item?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={onExport} ml={3}>
                Export
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ExportMessages;
