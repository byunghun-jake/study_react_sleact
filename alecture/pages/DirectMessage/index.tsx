import React from "react"
import { Header } from "@pages/DirectMessage/styles"
import ChatList from "@components/ChatList"
import ChatBox from "@components/ChatBox"
import gravatar from "gravatar"
import useSWR from "swr"
import fetcher from "@utils/fetcher"
import { IUser } from "@typings/db"
import { useParams } from "react-router"

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>()
  const { data: userData } = useSWR<IUser>(id && workspace ? `/api/workspaces/${workspace}/users/${id}` : null, fetcher)

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
      <ChatBox></ChatBox>
    </div>
  )
}

export default DirectMessage
