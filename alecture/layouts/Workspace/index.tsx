import fetcher from "@utils/fetcher"
import React from "react"
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
import { Link, useParams } from "react-router-dom"
import { IUser } from "@typings/db"
import DMList from "@components/DMList"

const Workspace = () => {
  const { workspace } = useParams<{ workspace: string }>()
  const { data: userData } = useSWR<IUser>("/api/users", fetcher)

  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span>
              <ProfileImg src={gravatar.url(userData.email, { s: "36px", d: "retro" })} />
            </span>
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            )
          })}
          <AddButton>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>{userData?.Workspaces.find((v) => v.url === workspace)?.name}</WorkspaceName>
          <MenuScroll>
            <DMList></DMList>
          </MenuScroll>
        </Channels>
        <Chats />
      </WorkspaceWrapper>
    </div>
  )
}

export default Workspace
