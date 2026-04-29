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
    { title: "Pembayaran", url: "/cashier/pembayaran", icon: CircleDollarSign },
    { title: "Mesin", url: "/operator/mesin", icon: WashingMachine },
    { title: "Operasi Mesin", url: "/operator/operasi", icon: Radius },
    { title: "Pelanggan", url: "/pelanggan", icon: Tags },
    { title: "User", url: "/admin/user", icon: User },
  ],
  operator: [],
  kitchen: [],
};
export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
