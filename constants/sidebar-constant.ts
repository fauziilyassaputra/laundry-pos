import {
  Album,
  CircleDollarSign,
  LayoutDashboard,
  Radius,
  Tags,
  User,
  WashingMachine,
} from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  manager: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Pesanan", url: "/pesanan", icon: Album },
    { title: "Pelanggan", url: "/pelanggan", icon: Tags },
    { title: "Pembayaran", url: "/pembayaran", icon: CircleDollarSign },
    { title: "User", url: "/admin/user", icon: User },
    { title: "Mesin", url: "/operator/mesin", icon: WashingMachine },
    { title: "Operasi Mesin", url: "/operator/operasi", icon: Radius },
  ],
  operator: [],
  kitchen: [],
};
export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
