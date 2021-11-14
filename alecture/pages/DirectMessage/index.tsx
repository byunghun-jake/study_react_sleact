import React, { useCallback } from "react"
import { Header } from "@pages/DirectMessage/styles"
import ChatList from "@components/ChatList"
import ChatBox from "@components/ChatBox"
import gravatar from "gravatar"
import useSWR from "swr"
import useSWRInfinite from "swr/infinite"
import fetcher from "@utils/fetcher"
import { IDM, IUser } from "@typings/db"
import { useParams } from "react-router"
import useInput from "@hooks/useInput"
import axios from "axios"

const PAGE_SIZE = 20
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>()
  const { data: myData } = useSWR<IUser>(`/api/users`, fetcher)
  const { data: userData } = useSWR<IUser>(id && workspace ? `/api/workspaces/${workspace}/users/${id}` : null, fetcher)
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
    fetcher,
  )

  const [chat, onChangeChat, setChat] = useInput("")

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault()
      if (myData && userData && chat?.trim() && chatData) {
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: chat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          })
          return prevChatData
        })
          .then(() => setChat(""))
          .catch(console.error)
      }
      axios
        .post(
          `/api/workspaces/${workspace}/dms/${id}/chats`,
          {
            content: chat,
          },
          {
            withCredentials: true,
          },
        )
        .catch(console.error)
    },
    [myData, userData, chatData, chat, mutateChat, workspace, id],
  )

  return (
    <div>
      <Header>
        {userData && (
          <>
            <img src={gravatar.url(userData.email, { s: "24px", d: "retro" })} />
            <span>{userData.nickname}</span>
          </>
        )}
      </Header>
      <ChatList></ChatList>
      {userData && (
        <ChatBox
          onChangeChat={onChangeChat}
          onSubmitForm={onSubmitForm}
          chat={chat}
          placeholder={`Message ${userData.nickname}`}
          data={[]}
        ></ChatBox>
      )}
    </div>
  )
}

export default DirectMessage
