

import { atom } from "recoil";

import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

interface ChatMessage {
    question: string;
    reply: string;
  }

const nameState =atom({
    key: 'nameState',
    default: '',
    effects_UNSTABLE: [persistAtom]
})

const authState =atom({
    key: 'authState',
    default: {},
    effects_UNSTABLE: [persistAtom]
})


  
export const chatMessagesState = atom<ChatMessage[]>({
    key: 'chatMessagesState',
    default: [],
    effects_UNSTABLE: [persistAtom]
  });

export {nameState, authState}