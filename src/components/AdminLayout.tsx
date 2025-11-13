"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/Sidebar";
import logo from '../assets/logo.webp'
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

import SidebarLinks from "./SidebarLinks";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import Header from "./Header";


export function AdminLayout() {
  
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full   flex-1 flex-col bg-white overflow-hidden rounded-md border border-neutral-200  md:flex-row ",
        "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {true ? <Logo /> : <LogoIcon />}
            <SidebarLinks />
          </div>
          <div>
            
            <SidebarLink
              link={{
                label: "Logout",
                href: "#",
                onClick: () => {
                   
                    const { logout } = useAuthStore.getState();
                    logout();
                  },
                icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-gray-700 " />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 h-full overflow-auto flex flex-col ">
                <div className="w-full hidden h-[9vh] md:flex items-center border-b-[1px]  border-gray-300" >
                   <Header open={open}  />
                </div>
              <div className="h-[89vh] md:h-[91vh] p-3 bg-blue-50">
                  <Dashboard />
              </div>
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
     <img src={logo} className="h-7 w-8 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm" alt="" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold whitespace-pre text-gray-700 "
      >
        Aditya Birla UltraTech
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <img src={logo} className="h-7 w-7 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm" alt="" />
    </a>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex h-full   w-full flex-1 ">
      <Outlet/>
    </div>
  );
};
