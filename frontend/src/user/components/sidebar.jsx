"use client";

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BookOpen,
  SquarePlay,
  SquareCheck,
  ArrowLeftRight,
  WalletCards,
  Loader,
  RectangleEllipsis,
  CircleDot,
  BookText,
  AudioWaveform,
} from "lucide-react";

const iconMap = {
  BookOpen,
  SquarePlay,
  SquareCheck,
  ArrowLeftRight,
  WalletCards,
  Loader,
  RectangleEllipsis,
  CircleDot,
  BookText,
  AudioWaveform,
};

const categories = [
  { name: "all", icon: "BookOpen" },
  { name: "buttons", icon: "SquarePlay" },
  { name: "checkboxes", icon: "SquareCheck" },
  { name: "toggle switches", icon: "ArrowLeftRight" },
  { name: "cards", icon: "WalletCards" },
  { name: "loaders", icon: "Loader" },
  { name: "inputs", icon: "RectangleEllipsis" },
  { name: "radio buttons", icon: "CircleDot" },
  { name: "forms", icon: "BookText" },
  { name: "patterns", icon: "AudioWaveform" }
];

export default function Sidebar({ isOpen }) {
  return (
   <div className="relative h-full overflow-hidden">
      <nav
        className="h-[50%] overflow-auto custom-scrollbar-transparent"
        role="navigation"
        aria-label="Main navigation"
      >
        {categories.map(({ name, icon }) => {
          const IconComponent = iconMap[icon];
          return (
            <NavLink
              key={name}
              to={name === "all" ? "/elements" : `/${name}`}
              className={`mb-1 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-normal tracking-wide transition-colors hover:bg-[rgb(33,33,33)] text-white"
                  `}
            >
              <div className="flex items-center gap-3 ">
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span className="capitalize">{name}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>
      </div>
  );
}
