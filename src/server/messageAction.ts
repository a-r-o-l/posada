"use server";

import dbConnect from "@/lib/mongoose";
import models from "@/models";
import { revalidatePath } from "next/cache";

export const createMessage = async (data: FormData) => {
  try {
    await dbConnect();
    const formData = Object.fromEntries(data.entries());
    const newMsg = new models.Message({
      date: new Date(),
      title: formData.title,
      text: formData.text,
      name: formData.name,
      email: formData.email,
    });
    await newMsg.save();
    return {
      success: true,
      message: "Mensaje creado correctamente",
      messageData: JSON.parse(JSON.stringify(newMsg)),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message: "Problemas en el servidor, intente nuevamente.",
    };
  }
};

export const getMessages = async () => {
  try {
    await dbConnect();
    const messages = await models.Message.find().sort({ date: -1 }).lean();
    const parsedMessages = JSON.parse(JSON.stringify(messages));
    return {
      success: true,
      message: "Mensajes encontrados",
      messageData: parsedMessages,
    };
  } catch (error) {
    console.error("Error getting messages:", error);
    return {
      success: false,
      message: "Problemas en el servidor, intente nuevamente.",
    };
  }
};

export const readMessage = async (id: string) => {
  try {
    await dbConnect();
    const message = await models.Message.findByIdAndUpdate(id, {
      isNewMessage: false,
    });
    if (!message) {
      return {
        success: false,
        message: "Mensaje no encontrado",
      };
    }
    revalidatePath("/admin/messages");
    const parsedMessages = JSON.parse(JSON.stringify(message));
    return {
      success: true,
      message: "Mensaje encontrado",
      messageData: parsedMessages,
    };
  } catch (error) {
    console.error("Error getting message:", error);
    return {
      success: false,
      message: "Problemas en el servidor, intente nuevamente.",
    };
  }
};

export const getNewMessagesCount = async () => {
  try {
    await dbConnect();
    const newMessagesCount = await models.Message.countDocuments({
      isNewMessage: true,
    });
    return newMessagesCount;
  } catch (error) {
    console.error("Error getting new messages count:", error);
    return 0;
  }
};
