"use client";
import {
  Blocks,
  Folder,
  Home,
  Images,
  Mail,
  School,
  Truck,
  User,
} from "lucide-react";
import AppSideBarMenuItem from "./AppSideBarMenuItem";
import { useAuthStore } from "@/zustand/auth-store";

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
    title: "Carpetas",
    url: "/admin/folders",
    icon: Folder,
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
  {
    title: "Tutorial",
    url: "/admin/tutorial",
    icon: Blocks,
    private: false,
  },
];

function AppSideBarMenu() {
  const { currentUser: user } = useAuthStore();

  // useEffect(() => {
  //   const getNewMessagesCountRuner = async () => {
  //     const res = await getNewMessagesCount();
  //     setNewMessagesCount(res);
  //   };
  //   const getNewSalesCountRuner = async () => {
  //     const res = await getNewSalesCount();
  //     setNewSalesCount(res);
  //   };
  //   getNewSalesCountRuner();
  //   getNewMessagesCountRuner();
  // }, []);

  return (
    <>
      {items.map((item) => {
        return (
          <AppSideBarMenuItem
            key={item.title}
            item={item}
            role={user?.role || "user"}
          />
        );
      })}
    </>
  );
}

export default AppSideBarMenu;
