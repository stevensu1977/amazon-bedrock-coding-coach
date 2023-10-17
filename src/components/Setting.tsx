import { useState, useRef } from "react";

import { Input, IconButton, Box, Button, Select, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Textarea } from "@chakra-ui/react";
import { IoSettingsOutline } from "react-icons/io5"


import { useSetRecoilState,useRecoilValue} from "recoil";
import {authSettings,authState} from "../state"



const Setting = () => {
    const [isOpen, setIsOpen] = useState(false);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const [authType, setAuthType] = useState("IAMROLE");
    const [akValue, setAkValue] = useState("");
    const [skValue, setSkValue] = useState("");
    const [cognitoIDValue, setCognitoIDValue] = useState("");
    const [cognitoRegionValue, setCognitoRegionValue] = useState("us-east-1");
    const [callerValue, setCallerValue] = useState("");

    const setAuthSettings = useSetRecoilState(authSettings)
    const auth= useRecoilValue(authState)

    const onClose = () => setIsOpen(false);

    const handleAuthTypeChange = (e) => {
        setAuthType(e.target.value);
        setCallerValue("")
    };

    const handleCognitoRegionChange = (e) => {
        setCognitoRegionValue(e.target.value);
        if (callerValue!==""){
            setCallerValue("")
        }
       
    };

    const handleSaveClick = (e) => {
        setAuthSettings({authType,akValue,skValue,cognitoIDValue,cognitoRegionValue})
        console.log({authType,akValue,skValue,cognitoIDValue,cognitoRegionValue})
        setIsOpen(false)
    };


    const handleTestClick = () => {
        fetch("/api/caller", {
          method: "POST",
          body: JSON.stringify({ authType,akValue,skValue,cognitoIDValue,cognitoRegionValue }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const {me} = data
            console.log(data); // You can update the state or perform any other action with the response data
            if (me===""){
                setCallerValue("Auth failed, can't get caller identity")
            }else{
                setCallerValue(me)
            }
           

            })
          .catch((error) => {
            console.error(error);
          });
      };

    return (
        <>
            <IconButton
                right={4}
                icon={<IoSettingsOutline />}
                aria-label="Toggle Theme"
                onClick={() => setIsOpen(true)}
            > Open Dialog</IconButton>

            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent maxW="600px" >
                        <AlertDialogHeader>Settings</AlertDialogHeader>
                        <AlertDialogBody>
                            Settings {authType}
                            <Select value={authType} id="auth-type" onChange={handleAuthTypeChange}>
                                {auth.role==="admin"&& <option value="IAMROLE">IAM ROLE</option>}
                               
                                <option value="AKSK">AK/SK</option>
                                <option value="COGNITO">Cognito</option>
                            </Select>
                            {authType === "AKSK" && (
                                <>
                                    <Box mt="10px">
                                        <label htmlFor="ak">AK:</label>
                                        <Input type="text" id="ak" value={akValue} onChange={(e) => setAkValue(e.target.value)} />
                                    </Box>
                                    <Box>
                                        <label htmlFor="sk">SK:</label>
                                        <Input type="text" id="sk" value={skValue} onChange={(e) => setSkValue(e.target.value)} />
                                    </Box>
                                </>
                            )}

                            {authType === "COGNITO" && (
                                <Box mt="10px">
                                    <label htmlFor="cognito">Cognito Region:</label>
                                    <Select value={cognitoRegionValue} id="cognito-region" onChange={handleCognitoRegionChange}>
                                        <option value="us-east-1">N. Virginia</option>
                                    </Select>
                                    <label htmlFor="cognito">Cognito ID:</label>
                                    <Input type="text" id="cognito" value={cognitoIDValue} onChange={(e) => setCognitoIDValue(e.target.value)} />
                                </Box>
                            )}
                             <Box mt="20px">
                                Caller Identity: {callerValue}
                            </Box>

                        </AlertDialogBody>
                        <AlertDialogFooter>

                            <Button ref={cancelRef} onClick={onClose}>
                                Close
                            </Button>
                            <Button colorScheme="blue" ml={3} onClick={handleTestClick}>
                                Test
                            </Button>

                            <Button colorScheme="red" ml={3} isDisabled={callerValue===""} onClick={handleSaveClick}>
                                Save
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default Setting;
