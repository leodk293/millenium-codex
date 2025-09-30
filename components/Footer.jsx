import React from "react";
import { Link } from "react-router-dom";
import { Youtube, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" flex flex-col gap-5 items-center mt-[7rem] w-full bg-white/5 text-white py-10 text-center">
      <div className=" flex flex-wrap gap-5 justify-center items-center">
        <a
          className=" border bg-gray-900 border-transparent p-2 rounded-full"
          href="https://www.youtube.com/@aboubacartraore5831"
        >
          <Youtube size={32} color="#ffffff" strokeWidth={1} />
        </a>
        <a
          className=" border bg-gray-900 border-transparent p-2 rounded-full"
          href="https://www.facebook.com/profile.php?id=100092315485742"
        >
          <Facebook size={32} color="#ffffff" strokeWidth={1} />
        </a>
        <a
          className=" border bg-gray-900 border-transparent p-2 rounded-full"
          href="https://x.com/Aboubac48530295"
        >
          <Twitter size={32} color="#ffffff" strokeWidth={1} />
        </a>
      </div>
      <span className=" rounded-full w-[90%] p-[1px] bg-gray-400" />
      <p>
        © {new Date().getFullYear()} Millennium Codex. All rights reserved.
      </p>
    </footer>
  );
}
