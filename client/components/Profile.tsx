import { useUserContext } from "@/context/userContext";
import Image from "next/image";
import React from "react";

function Profile() {
  const { photo, name, email } = useUserContext().user;

  console.log("Profile photo:", photo);
  return (
    <div className="text-white flex flex-col items-center">
      <Image
        src={photo ? photo : "/default-profile.png"}
        className="rounded-full"
        alt=""
        width={80}
        height={80}
      />

      <h2 className="mt-2 font-bold">{name}</h2>
      <p className="text-sm text-gray-400">{email}</p>
    </div>
  );
}

export default Profile;
