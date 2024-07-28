import React from "react";
import { CHAT_KEY } from "~/utils/constants";

import { PrettyChatWindow } from "react-chat-engine-pretty";
const userId = JSON.parse(
  window.sessionStorage.getItem(
    "oidc.user:https://feid.ptudev.net:societe-front-end"
  )
)?.profile?.userId;
const projectId = CHAT_KEY.ProjectID;
const username = userId;
const secret = userId;
export default function ChatsPage() {
  return (
    <>
      <PrettyChatWindow
        projectId={projectId}
        username={username}
        secret={secret}
        height="calc(100vh - 12px)"
      />
    </>
  );
}
