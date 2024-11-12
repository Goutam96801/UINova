import React, { useState, useEffect, useRef, useContext } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Moon, Sun, FolderClock, Rocket } from "lucide-react";
import LoadingBar from "react-top-loading-bar";
import axios from "axios";
import { UserContext } from "../../App";
import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../../common/page-animation";
import PostSubmitAlert from "./post-submit-aler";

export default function CodeEditor({ selectedCategory }) {
  const [htmlCode, setHtmlCode] = useState("<h1>Hello, World!</h1>\n");
  const [cssCode, setCssCode] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("html");
  const [backgroundColor, setBackgroundColor] = useState("#e8e8e8");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const previewRef = useRef(null);
  const shadowRootRef = useRef(null);
  const [progress, setProgress] = useState(0);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      setBackgroundColor("#e8e8e8");
      setIsDarkMode(false);
    } else {
      setBackgroundColor("#212121");
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    if (previewRef.current && !shadowRootRef.current) {
      shadowRootRef.current = previewRef.current.attachShadow({ mode: "open" });
    }

    if (shadowRootRef.current) {
      // Update shadow root content
      shadowRootRef.current.innerHTML = `
        <style>
          * {
            // background-color: ${backgroundColor};
            transition: background-color 0.5s, color 0.5s;
            margin: 0;
            padding: 0;
            color: #000;
          }
          ${cssCode}
        </style>
        <div>${htmlCode}</div>
      `;
    }
  }, [htmlCode, cssCode, backgroundColor, isDarkMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProgress(70);
    e.target.classList.add("disabled");

    setTimeout(() => {
      setOpenModal(true);
      e.target.classList.remove("disabled");
      setProgress(100);
    }, 500);
  };

  const handleCloseBtn = () => {
    setOpenModal(false);
  };

  const handleSubmitBtn = (e) => {
    e.preventDefault();
    setProgress(70);
    e.target.classList.add("disabled");
    
    const postData = {
      htmlCode,
      cssCode,
      category: selectedCategory,
      status: "under review",
      theme:backgroundColor === '#e8e8e8'? "dark" : "light"
    };

    setTimeout(() => {
      axios
        .post(process.env.REACT_APP_SERVER_DOMAIN + "/create-post", postData, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(() => {
          setProgress(100);
          setOpenModal(false);
          e.target.classList.remove("disabled");
          toast.success("");
        })
        .catch(({ response }) => {
          setProgress(100);
          e.target.classList.remove("disabled");
          toast.error("Error occured", response);
        });
    }, 300);
  };

  const handleDraft = (e) => {
    e.preventDefault();
    setProgress(70);
    e.target.classList.add("disabled");

    const postData = {
      htmlCode,
      cssCode,
      category: selectedCategory,
      status: "draft",
    };

    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/create-post", postData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        setProgress(100);
        e.target.classList.remove("disabled");
        toast.success("saved to draft.");
      })
      .catch(({ response }) => {
        setProgress(100);
        e.target.classList.remove("disabled");
        toast.error("Error occured", response);
      });
  };


  const getLuminance = (hexColor) => {
    const rgb = hexToRgb(hexColor);
    const [r, g, b] = rgb.map((value) => {
      const sRGB = value / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Convert HEX to RGB
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  // Determine text color based on luminance
  const textColor = getLuminance(backgroundColor) < 0.5 ? "white" : "black";

  return (
    <AnimationWrapper transition>
      <div className="max-h-[calc(100vh-10rem)] px-4">
        <LoadingBar
          color="red"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <Toaster />
        <div className="flex flex-col-reverse md:flex-row bg-[#28282811]">
          <div
            style={{ backgroundColor: backgroundColor }}
            className="flex relative rounded-md w-full md:w-1/2 left-0 top-0 py-10 overflow-hidden h-[calc(100vh-10rem)]"
          >
            <div className={`flex h-full w-full `}>
              <div
                ref={previewRef}
                className="flex overflow-y-auto items-center justify-center h-full w-full relative z-1"
              ></div>
            </div>

            <div className="p-4 flex items-center gap-3 absolute top-0 right-0 z-10">
              <p style={{ color: textColor }} className="font-semibold">
                {backgroundColor}
              </p>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => {
                  setBackgroundColor(e.target.value);
                }}
                className="w-8 h-8 rounded-t border-none outline-none bg-[#212121]"
              />
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  isDarkMode
                    ? "bg-gray-700 text-white "
                    : "bg-yellow-400 text-gray-900 "
                }`}
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ?  <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>

          <div className="w-full h-[calc(100vh-10rem)] md:w-1/2 pl-2">
            <div className="mb-0 flex ">
              <button
                className={`px-4 py-[6px] rounded-t text-white font-semibold flex items-center gap-1 ${
                  activeTab === "html" ? "bg-[#71717111]" : "bg-[#434343] "
                }`}
                onClick={() => setActiveTab("html")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="text-[#e74d4d] w-5 h-5"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M12 18.178l4.62-1.256.623-6.778H9.026L8.822 7.89h8.626l.227-2.211H6.325l.636 6.678h7.82l-.261 2.866-2.52.667-2.52-.667-.158-1.844h-2.27l.329 3.544L12 18.178zM3 2h18l-1.623 18L12 22l-7.377-2L3 2z"
                  ></path>
                </svg>
                HTML
              </button>
              <button
                className={`px-4 py-[6px] rounded-t text-white font-semibold flex items-center gap-1 ${
                  activeTab === "css" ? "bg-[#a5a5a511]" : "bg-[#434343] "
                }`}
                onClick={() => setActiveTab("css")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="text-blue-600 w-5 h-5"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M5 3l-.65 3.34h13.59L17.5 8.5H3.92l-.66 3.33h13.59l-.76 3.81-5.48 1.81-4.75-1.81.33-1.64H2.85l-.79 4 7.85 3 9.05-3 1.2-6.03.24-1.21L21.94 3z"
                  ></path>
                </svg>
                CSS
              </button>
            </div>
            <div className="w-full h-[calc(100vh-12.3rem)] border border-[#212121] pt-2 rounded-b-lg rounded-r-lg overflow-hidden bg-[#71717111]">
              <MonacoEditor
                height="100%"
                language={activeTab}
                theme="vs-dark"
                value={activeTab === "html" ? htmlCode : cssCode}
                onChange={(value) =>
                  activeTab === "html"
                    ? setHtmlCode(value || "")
                    : setCssCode(value || "")
                }
                options={{
                  minimap: { enabled: false },
                  // smoothScrolling: true,
                  scrollbar: {
                    vertical: "auto",
                    horizontal: "auto",
                    verticalScrollbarSize: 10,
                    alwaysConsumeMouseWheel: false,
                  },
                  fontSize: 14,
                  wordWrap: "on",
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                  autoClosingComments: "always",
                }}
                // editorDidMount={editorDidMount}
              />
            </div>
          </div>
        </div>
        <div className="items-stretch mt-2 p-2 col-span-full bg-[#212121] rounded-xl md:block">
          <div className="flex flex-col md:flex-row items-stretch justify-end gap-2 h-full flex-wrap min-h-[40px]">
            <div className="flex justify-end items-stretch gap-2">
              <button onClick={handleDraft} className="px-4 py-2.5 font-sans hidden sm:flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-300 hover:bg-[#c5c5c511] text-offwhite cursor-pointer">
                <FolderClock />
                Save as a draft
              </button>
              <button
                onClick={handleSubmit}
                className=" px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-sm font-semibold transition-colors duration-300 cursor-pointer text-white bg-green-600 hover:bg-green-700 whitespace-nowrap"
              >
                <Rocket />
                Submit for review
              </button>
            </div>
          </div>
        </div>
      </div>

      {openModal ? (
        <PostSubmitAlert
          handleCloseBtn={handleCloseBtn}
          handleSubmitBtn={handleSubmitBtn}
        />
      ) : (
        ""
      )}
    </AnimationWrapper>
  );
}
