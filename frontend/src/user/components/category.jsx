import React, { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimationWrapper from "../../common/page-animation";

function PostCategory({ onContinue }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

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
  };

  const categories = [
    { name: "buttons", icon: "SquarePlay" },
    { name: "checkboxes", icon: "SquareCheck" },
    { name: "toggle switches", icon: "ToggleRight" },
    { name: "cards", icon: "WalletCards" },
    { name: "loaders", icon: "Loader" },
    { name: "inputs", icon: "RectangleEllipsis" },
    { name: "radio buttons", icon: "CircleDot" },
    { name: "forms", icon: "BookText" },
    { name: "patterns", icon: "AudioWaveform" },
  ];

  const handleOnChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      onContinue(selectedCategory);
    }
  };

  const handleClose = () => {
    navigate(-1);
  }

  return (
    <AnimationWrapper transition>
      <div
        className="fixed top-0 left-0 right-0 bottom-0 z-50"
        data-testid="root"
      >
        <div
          className="bg-[#00000080] fixed top-0 left-0 right-0 bottom-0 -z-10"
          data-testid="overlay"
          aria-hidden="true"
        ></div>
        <div
          className=" h-full outline-none overflow-x-hidden overflow-y-auto text-center"
          data-testid="modal-container"
        >
          <div
            className="relative m-auto max-w-[900px] w-full rounded-3xl overflow-hidden border-2 border-[#a5a5a511]/80 p-16 bg-[#212121]"
            role="dialog"
            aria-modal="true"
            data-testid="modal"
            tabIndex="-1"
          >
            <div className="flex items-center justify-center flex-col">
              <h3 className="mb-8 text-4xl font-extrabold text-gray-200">
                What are you making?
              </h3>
              <div className="self-stretch grid gap-2.5 grid-cols-options">
                {categories.map(({ name, icon }) => {
                  const IconComponent = iconMap[icon];
                  return (
                    <label
                      key={name}
                      className={`h-[135px] rounded-lg flex-1 basis-0 border-2 flex flex-col items-center select-none cursor-pointer transition-all duration-300 group bg-[#212121] hover:border-gray-200 border-[#a5a5a511] px-5 py-5 justify-center ${selectedCategory === name ? 'border-indigo-600' : ''}`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={name}
                        onChange={handleOnChange}
                        className="hidden"
                      />
                      {IconComponent && <IconComponent className="w-8 h-8" />}
                      <span className="capitalize flex items-center text-center text-[#a0a0a0] font-semibold">
                        {name}
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="flex items-center flex-col mt-7 gap-3.5 lg:flex-row self-end lg:gap-2">
              <button
                    className="px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-200 hover:bg-[#87858511] bg-[#a5a5a511] text-offwhite cursor-pointer"
                    type="button"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                <button
                  onClick={handleContinue}
                  className="px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 text-offwhite cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
            <button
              className="absolute top-10 right-10"
              data-testid="close-button"
              onClick={handleClose}
            >
              <X />
            </button>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default PostCategory;
