import React, { useEffect, useState } from "react";
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
import AstronautImg from "../../assets/astronaut.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion"
import ClipLoader from "react-spinners/ClipLoader";

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

  const [categories, setCategories] = useState([
    { name: "all", icon: "BookOpen", value: null },
    { name: "buttons", icon: "SquarePlay", value: null },
    { name: "checkboxes", icon: "SquareCheck", value: null },
    { name: "toggle switches", icon: "ToggleRight", value: null },
    { name: "cards", icon: "WalletCards", value: null },
    { name: "loaders", icon: "Loader", value: null },
    { name: "inputs", icon: "RectangleEllipsis", value: null },
    { name: "radio buttons", icon: "CircleDot", value: null },
    { name: "forms", icon: "BookText", value: null },
    { name: "patterns", icon: "AudioWaveform", value: null },
    { name: "tooltips", icon: "Info", value: null },
    { name: "my favourites", icon: "BookMarked", value: null },
  ]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const filteredCategories = categories.filter(
          (category) =>
            category.name !== "all" && category.name !== "my favourites"
        );

        const categoryNames = filteredCategories.map(
          (category) => category.name
        );
        const response = await axios.post(
          process.env.REACT_APP_SERVER_DOMAIN + "/post-counts",
          {
            categories: categoryNames,
          }
        );
        const counts = response.data;

        const updatedCategories = categories.map((category) => {
          const match = counts.find(
            (count) => count.category === category.name
          );
          return { ...category, value: match ? match.count : 0 };
        });
        // Combine updated values with excluded categories
        setCategories(updatedCategories);
      } catch (error) {
        console.error("Error fetching category counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <AnimationWrapper transition={0.3} className={"absolute top-10 z-50"}>
      <div className="z-50 mt-2 duration-300 bg-[#171717] p-3 border-[#2a2a2a] border-2 rounded-2xl w-[720px] flex">
        <div className="w-2/3 flex gap-2  flex-wrap flex-row">
          {categories.map(({ name, icon, value }) => {
            const IconComponent = iconMap[icon];
            return (
              <motion.button
              key={name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/${name === "all" ? "elements" : name}`}
                key={name}
                className={`w-56 rounded-md flex flex-row justify-between gap-2 items-center cursor-pointer transition-all duration-300 bg-[#212121] hover:border-gray-200 border-[#a5a5a511] p-2`}
              >
                <div className="flex gap-2">
                  <input type="radio" name="category" className="hidden" />
                  {IconComponent && <IconComponent className="w-6 h-6" />}
                  <span className="capitalize flex items-center text-center text-[#a0a0a0] font-semibold">
                    {name}
                  </span>
                </div>
                <span className="text-sm text-white/50 text-center flex justify-center items-center">
                  {name !== "all" &&
                    name !== "my favourites" &&
                    (value !== null ? (
                      value
                    ) : (
                      <ClipLoader
                        color="#983fa5"
                        size={15}
                        />
                    ))}
                </span>
              </Link>
              </motion.button>
            );
          })}
        </div>

        
        <div className="bg-custom-gradient rounded-md w-1/3 h-auto space-y-1">
          <div className="flex items-center justify-center mt-2">
            <img src={AstronautImg} width={100} className="" />
          </div>
          <div className="space-y-2">
            <h1 className="text-[24px] font-bold text-center px-8">
              We're on Social Media!
            </h1>
            <p className="text-sm text-center">
              Follow us to find about new challenges updates and posts.
            </p>
          </div>
          <div className="flex justify-center items-center gap-4  pb-2">
            <Link>
              <Instagram />
            </Link>
            <Link>
              <Facebook />
            </Link>
            <Link>
              <Twitter />
            </Link>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default CategoryDropdown;
