"use client";
import Sidebar from "@/components/Sidebar";
import useRedirect from "@/hooks/useUserRedirect";

export default function Home() {
  useRedirect("/login");

  return (
    <div>
      <h1>Gello</h1>
    </div>
  );
}
