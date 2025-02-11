"use client";
import { Baby, Home, Images, Mail, School, Truck, User } from "lucide-react";
import AppSideBarMenuItem from "./AppSideBarMenuItem";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { getNewMessagesCount } from "@/server/messageAction";
import { getNewSalesCount } from "@/server/saleAction";

const items = [
  {
    title: "Inicio",
    url: "/admin",
    icon: Home,
    private: false,
  },
  {
    title: "Cuentas",
    url: "/admin/accounts",
    icon: User,
    private: false,
  },
  {
    title: "Alumnos",
    url: "/admin/students",
    icon: Baby,
    private: false,
  },
  {
    title: "Colegios",
    url: "/admin/schools",
    icon: School,
    private: false,
  },
  {
    title: "Productos",
    url: "/admin/products",
    icon: Images,
    private: false,
  },
  {
    title: "Pedidos",
    url: "/admin/orders",
    icon: Truck,
    private: false,
  },
  {
    title: "Mensajes",
    url: "/admin/messages",
    icon: Mail,
    private: false,
  },
];

function AppSideBarMenu() {
  const { user } = useUser();
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [newSalesCount, setNewSalesCount] = useState(0);

  useEffect(() => {
    const getNewMessagesCountRuner = async () => {
      const res = await getNewMessagesCount();
      setNewMessagesCount(res);
    };
    const getNewSalesCountRuner = async () => {
      const res = await getNewSalesCount();
      setNewSalesCount(res);
    };
    getNewSalesCountRuner();
    getNewMessagesCountRuner();
  }, []);

  return (
    <>
      {items.map((item) => {
        return (
          <AppSideBarMenuItem
            key={item.title}
            item={item}
            role={user?.role || "user"}
            notification={
              item.title === "Mensajes"
                ? newMessagesCount
                : item.title === "Pedidos"
                ? newSalesCount
                : undefined
            }
          />
        );
      })}
    </>
  );
}

export default AppSideBarMenu;
