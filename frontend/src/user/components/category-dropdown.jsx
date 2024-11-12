import React from "react";
import AnimationWrapper from "../../common/page-animation";
import {
  X,
  BookOpen,
  SquarePlay,
  SquareCheck,
  ToggleRight,
  WalletCards,
  Loader,
  RectangleEllipsis,
  CircleDot,
  BookText,
  AudioWaveform,
  Info,
  BookMarked,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import AstronautImg from '../../assets/astronaut.png'
import { Link } from "react-router-dom";

function CategoryDropdown() {
  const iconMap = {
    BookOpen,
    SquarePlay,
    SquareCheck,
    ToggleRight,
    WalletCards,
    Loader,
    RectangleEllipsis,
    CircleDot,
    BookText,
    AudioWaveform,
    Info,
    BookMarked,
  };

  const categories = [
    { name: "all", icon: "BookOpen", value: null },
    { name: "buttons", icon: "SquarePlay", value: 241 },
    { name: "checkboxes", icon: "SquareCheck", value: 220 },
    { name: "toggle switches", icon: "ToggleRight", value: 1121 },
    { name: "cards", icon: "WalletCards", value: 2412 },
    { name: "loaders", icon: "Loader", value: 349 },
    { name: "inputs", icon: "RectangleEllipsis", value: 141 },
    { name: "radio buttons", icon: "CircleDot", value: 241 },
    { name: "forms", icon: "BookText", value: 2413 },
    { name: "patterns", icon: "AudioWaveform", value: 2414 },
    { name: "tooltips", icon: "Info", value: "390" },
    { name: "my favourites", icon: "BookMarked", value: null },
  ];

  return (
    <AnimationWrapper transition={0.3} className={'absolute top-10 z-50'}>
      <div className="z-50 mt-2 duration-300 bg-[#171717] p-3 border-[#2a2a2a] border-2 rounded-md w-[720px] flex" >
        <div className="w-2/3 flex gap-2  flex-wrap flex-row">
        {categories.map(({ name, icon, value }) => {
                  const IconComponent = iconMap[icon];
                  return (
                    <label
                      key={name}
                      className={`w-56 rounded-md flex flex-row justify-between gap-2 items-center  cursor-pointer transition-all duration-300 bg-[#212121] hover:border-gray-200 border-[#a5a5a511] p-2 `}
                    >
                        <div className="flex gap-2">
                      <input
                        type="radio"
                        name="category"
                        // value={name}
                        // onChange={handleOnChange}
                        className="hidden"
                      />
                      {IconComponent && <IconComponent className="w-6 h-6" />}
                      <span className="capitalize flex items-center text-center text-[#a0a0a0] font-semibold">
                        {name}
                      </span>
                      </div>
                      <span>{value}</span>
                    </label>
                  );
                })}
        </div>
        <div className="bg-custom-gradient rounded-md w-1/3 h-auto space-y-1">
        <div className="flex items-center justify-center mt-2">
        <img src={AstronautImg} width={100} className=""/>
        </div>
        <div className="space-y-2">
            <h1 className="text-[24px] font-bold text-center px-8">We're on Social Media!</h1>
            <p className="text-sm text-center">Follow us to find about new challenges updates and posts.</p>
        </div>
        <div className="flex justify-center items-center gap-4  pb-2">
            <Link><Instagram /></Link>
            <Link><Facebook /></Link>
            <Link><Twitter /></Link>
        </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default CategoryDropdown;
