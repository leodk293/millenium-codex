import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="fixed py-5 top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-sm shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" flex flex-wrap gap-5 items-center justify-center md:justify-between md:gap-0">
            <a href={"/"}>
              <h1 className=" text-2xl text-white font-bold">
                Millennium Codex
              </h1>
            </a>
            <nav className="flex items-center gap-6 text-sm text-white">
              <a
                target="_blank"
                href="https://www.youtube.com/@aboubacartraore5831"
                className=" hover:scale-105 transition-transform"
              >
                Youtube
              </a>
              <a
                className=" hover:scale-105 transition-transform"
                target="_blank"
                href="https://x.com/Aboubac48530295"
              >
                X/Twitter
              </a>
              <a
                target="_blank"
                className=" hover:scale-105 transition-transform"
                href="https://www.facebook.com/profile.php?id=100092315485742"
              >
                Facebook
              </a>
            </nav>
            <Link
              className=" bg-gray-900 text-lg text-white font-medium rounded-lg px-4 py-2 hover:translate-x-1 transition-transform"
              to={"/contact"}
            >
              Contact
            </Link>
          </div>
        </div>
      </header>

      <div aria-hidden="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16" />
        </div>
      </div>
    </>
  );
}
