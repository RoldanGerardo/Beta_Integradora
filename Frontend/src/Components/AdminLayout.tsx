import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

type Props = {
  vistaActual: string;
  cambiarVista: (vista: string) => void;
  children: ReactNode;
};

export default function AdminLayout({ vistaActual, cambiarVista, children }: Props) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar vistaActual={vistaActual} cambiarVista={cambiarVista} />
      {children}
    </div>
  );
}