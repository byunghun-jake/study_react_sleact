import fetcher from "@utils/fetcher"
import React, { useEffect } from "react"
import useSWR from "swr"
import gravatar from "gravatar"
import {
  AddButton,
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceButton,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from "./styles"
import { Link, useParams, Route, Switch } from "react-router-dom"
import { IUser } from "@typings/db"
import DMList from "@components/DMList"
import DirectMessage from "@pages/DirectMessage"
import Channel from "@pages/Channel"
import useSocket from "@hooks/useSocket"

const Workspace = () => {
  const { workspace } = useParams<{ workspace: string }>()
  const { data: myData } = useSWR<IUser>("/api/users", fetcher)
  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher)
  const [socket, disconnectSocket] = useSocket(workspace)

  useEffect(() => {
    return () => {
      console.info("소켓 연결이 끊어졌습니다.", workspace)
      disconnectSocket()
    }
  }, [disconnectSocket, workspace])
  useEffect(() => {
    if (userData) {
      console.info("로그인하자")
      socket?.emit("login", { id: userData?.id, channels: [] })
    }
  }, [userData])

  return (
    <div>
      <Header>
        {myData && (
          <RightMenu>
            <span>
              <ProfileImg src={gravatar.url(myData.email, { s: "36px", d: "retro" })} />
            </span>
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {myData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            )
          })}
          <AddButton>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>{myData?.Workspaces.find((v) => v.url === workspace)?.name}</WorkspaceName>
          <MenuScroll>
            <DMList></DMList>
          </MenuScroll>
        </Channels>
        <Chats>
          {/* 같은 영역 내에서 주소가 바뀜에 따라 역할이 달라짐 = Route 사용 */}
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  )
}

export default Workspace
