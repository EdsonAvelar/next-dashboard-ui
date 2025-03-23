import { JSX } from "react";

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export type NegocioItem = {
  id: number;
  titulo: string;
  telefone: string;
  whatsapp: string;
  valor: number;
  cliente?: string;
  updatedAt: Date;
  tipo: String;
  daysDifference: number;
};
