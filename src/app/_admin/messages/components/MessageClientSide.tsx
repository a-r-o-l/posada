"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { IMessage } from "@/models/Message";
import { formatDate, formatDistanceToNow } from "date-fns";
import { Mail, MailOpen } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { readMessage } from "@/server/messageAction";
import { es } from "date-fns/locale";
function MessageClientSide({ messages }: { messages: IMessage[] | [] }) {
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);

  useEffect(() => {
    if (selectedMessage && selectedMessage.isNewMessage) {
      const runReadMessage = async () => await readMessage(selectedMessage._id);
      runReadMessage();
    }
  }, [selectedMessage]);

  const messagesQuantity = useMemo(() => {
    if (!messages) return { totalMessages: 0, newMessages: 0 };
    const totalMessages = messages?.length;
    const newMessages = messages?.filter(
      (message) => !message.isNewMessage
    ).length;
    return { totalMessages, newMessages };
  }, [messages]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mensajes</CardTitle>
        <CardDescription>
          Ver y administrar mensajes de usuarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Lista de mensajes</CardTitle>
                <Badge variant="outline" className="ml-2">
                  {messagesQuantity.newMessages} /{" "}
                  {messagesQuantity.totalMessages}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {!!messages.length ? (
                  messages?.map((message) => (
                    <Button
                      key={message._id}
                      variant={
                        selectedMessage?._id === message._id
                          ? "secondary"
                          : "outline"
                      }
                      className="w-full justify-start text-left mb-2 py-10"
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-center space-x-2 w-full justify-between">
                        <div className="flex items-center gap-5">
                          {!message?.isNewMessage ? (
                            <MailOpen className="h-4 w-4" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}

                          <div>
                            <div className="font-semibold">{message.name}</div>
                            <div className="text-sm text-gray-500">
                              {message.title}
                            </div>
                          </div>
                          {message.isNewMessage && (
                            <Badge variant="destructive" className="ml-auto">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(message.date), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </div>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p className="text-muted-foreground">No hay mensajes</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Detalles del mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedMessage.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    De: {selectedMessage.email}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Fecha: {formatDate(selectedMessage?.date, "dd/MM/yyyy")}
                  </p>
                  <Separator className="my-4" />
                  <p className="whitespace-pre-wrap">{selectedMessage.text}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Seleccione un mensaje para ver los detalles
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

export default MessageClientSide;
