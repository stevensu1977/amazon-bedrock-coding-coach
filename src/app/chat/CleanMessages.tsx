import { useState,useRef } from "react";
import { IconButton,Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "@chakra-ui/react";

import { MdOutlineDeleteForever } from "react-icons/md";




interface CleanMessagesProps {
  clearMessages: ()=> void;
}

const CleanMessages = ({clearMessages}:CleanMessagesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onDelete = () => {
    clearMessages();
    onClose();
  
  }
  return (
    <>
    <IconButton
            right={4}
            icon={ <MdOutlineDeleteForever/>}
            aria-label="Toggle Theme"
            colorScheme="teal"
            onClick={() => setIsOpen(true)}
            > Open Dialog</IconButton>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirmation</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to clean all messages ?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CleanMessages;
