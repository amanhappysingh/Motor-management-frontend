import React from "react";
import { SidebarLink } from "./ui/Sidebar";
import { IconArrowLeft, IconBrandTabler, IconMotorbike, IconUser } from "@tabler/icons-react";
import { PiEngine } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";
import { MdOutlineDisabledByDefault } from "react-icons/md";
import { IoTrailSignSharp } from "react-icons/io5";
import { BsFillHouseUpFill } from "react-icons/bs";
import { LiaWarehouseSolid } from "react-icons/lia";


const SidebarLinks = () => {
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-gray-700 " />,
    },
    {
      label: "Users",
      href: "/users",
      icon: <IconUser className="h-5 w-5 shrink-0 text-gray-700 " />,
    },
    
    {
      label: "All Motors",
      href: "/all-motors/all",
      icon: <PiEngine  className="h-5 w-5 shrink-0 text-gray-700 " />,
    },
    {
      label: "Motors In",
      href: "/all-motors/all-in-motors",
      icon: <BsFillHouseUpFill  className="h-5 w-5 shrink-0 text-gray-700 " />,
    },
    {
      label: "Motors Overhauling",
      href: "/all-motors/all-overhauling-motors",
      icon: <FiSettings  className="h-5 w-5 shrink-0 text-gray-700 " />,
    },
    {
      label: "Motors Trail",
      href: "/all-motors/all-trail-motors",
      icon: <IoTrailSignSharp  className="h-5 w-5 shrink-0 text-gray-700 " />,
    },
     {
      label: "Motors Available",
      href: "/all-motors/all-available-motors",
      icon: <LiaWarehouseSolid  className="h-5 w-5 shrink-0 text-gray-700 " />,
    },
    {
      label: "Motors Fault",
      href: "/all-motors/all-fault-motors",
      icon: <MdOutlineDisabledByDefault  className="h-5 w-5 shrink-0 text-gray-700 " />,
    },
   
    {
      label: "Motors Out",
      href: "/all-motors/all-out-motors",
      icon: <LiaWarehouseSolid  className="h-5 w-5 shrink-0 text-gray-700 " />,
    },
    {
      label: "Motors Reports",
      href: "/reports",
      icon: <TbReportAnalytics className="h-5 w-5 shrink-0 text-gray-700 " />,
    },
   
  ];
  return (
    <div className="mt-4 flex flex-col gap-2">
      {links?.map((link, idx) => (
        <SidebarLink key={idx} link={link} />
      ))}
    </div>
  );
};

export default SidebarLinks;
