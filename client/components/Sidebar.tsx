"use client";
import React from "react";
import Profile from "./Profile";
import { help, home, money, reports } from "@/util/Icons";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    {
      title: "Dashboard",
      icon: home,
      href: "/",
    },

    {
      title: "Transactions",
      icon: money,
      href: "/transactions",
    },

    {
      title: "Reports",
      icon: reports,
      href: "/reports",
    },

    {
      title: "FAQ",
      icon: help,
      href: "/faq",
    },
  ];

  return (
    <div className="fixed top-0 py-8 px-4 max-w-[16rem] w-full h-full border-r-2 border-[#2f3034] flex flex-col items-center">
      <Profile />

      <nav className="my-12 w-full text-gray-300">
        <ul className="flex flex-col gap-2">
          {menu.map((item, index) => {
            return (
              <li
                key={index}
                className={`nav-item p-4 rounded-[13px] grid grid-cols-[30px_1fr] cursor-pointer ${
                  pathname === item.href ? "text-white bg-[#313234]" : ""
                }`}
                onClick={() => router.push(item.href)}
              >
                <span
                  className={`${
                    pathname === item.href ? "text-[#88DDE2]" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`${pathname === item.href ? "font-medium" : ""}`}
                >
                  {item.title}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="mt-auto w-full">
        <Button
          className="w-full cursor-pointer py-7"
          variant={"rounded-white"}
        >
          Sign Out
        </Button>
      </footer>
    </div>
  );
}

export default Sidebar;
