import { getMessages } from "@/server/messageAction";
import React from "react";
import MessageClientSide from "./components/MessageClientSide";

export default async function page() {
  const { messageData } = await getMessages();

  return (
    <div className="container mx-auto p-4">
      <MessageClientSide messages={messageData} />
    </div>
  );
}
