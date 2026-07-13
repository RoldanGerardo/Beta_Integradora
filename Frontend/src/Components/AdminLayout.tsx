import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

type Props = {
  vistaActual: string;
  cambiarVista: (vista: string) => void;
  children: ReactNode;
};

export default function AdminLayout({ vistaActual, cambiarVista, children }: Props) {
  return (
    <div className="flex min-h-screen" style={{ background: "#F4F7FB" }}>
      <AdminSidebar vistaActual={vistaActual} cambiarVista={cambiarVista} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}