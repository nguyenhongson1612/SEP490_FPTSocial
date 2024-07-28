import React from "react";
import { CHAT_KEY } from "~/utils/constants";

import { ChatEngine } from "react-chat-engine";
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
      <ChatEngine
        projectID={projectId}
        userName={username}
        userSecret={secret}
        height="calc(100vh - 12px)"
      />
    </>
  );
}
