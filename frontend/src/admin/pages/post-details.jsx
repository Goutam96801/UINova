import {
  BadgeX,
  Ban,
  Check,
  Moon,
  MoveLeft,
  Sun,
  UserRound,
} from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AnimationWrapper from "../../common/page-animation";
import LoadingBar from "react-top-loading-bar";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { AdminContext } from "../../App";
import ApproveModal from "../components/approve-modal";
import PostRejectAlert from "../components/reject-modal";
export const postDataStructure = {
  category: "",
  createdAt: "",
  cssCode: "",
  htmlCode: "",
  postId: "",
  saved: 0,
  status: "",
  tags: [],
  updatedAt: "",
  user: { personal_info: {} },
};

function AdminPostDetails() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(postDataStructure);
  const [activeTab, setActiveTab] = useState("html");
  const [backgroundColor, setBackgroundColor] = useState("#e8e8e8");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const previewRef = useRef(null);
  const shadowRootRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  let {
    adminAuth: { access_token },
  } = useContext(AdminContext);

  let {
    category,
    htmlCode,
    cssCode,
    updatedAt,
    user: {
      personal_info: { username, profile_img },
    },
    createdAt,
  } = post;

  const fetchPostDetails = () => {
    if (!access_token) return;

    setLoading(true); // Start loading

    axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/admin/get-post",
        { postId: postId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setPost(data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPostDetails();
  }, [access_token]);

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
          ${post.cssCode}
        </style>
        <div>${htmlCode}</div>
      `;
    }
  }, [htmlCode, cssCode, backgroundColor, isDarkMode]);

  const handleApprove = () => {
    setProgress(70);
    setTimeout(() => {
        setProgress(100)
        setApproveModal(true);
    },500)
  }

  const handleReject = () => {
    setProgress(70);
    setTimeout(() => {
        setProgress(100)
        setRejectModal(true);
    },500)
  }

  const handleCloseBtn = () => {
    setRejectModal(false)
  }

  const handleGoBack = () => {
    setProgress(70);
    setTimeout(() => {
        setProgress(100);
        navigate(-1);
    },500)
  }

  const toggleDarkMode = () => {
    if (isDarkMode) {
      setBackgroundColor("#212121");
      setIsDarkMode(false);
    } else {
      setBackgroundColor("#e8e8e8");
      setIsDarkMode(true);
    }
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
      <div className="flex justify-between w-[calc(100vw-250px)] px-4 py-2  my-2">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1 bg-[#212121] px-2 py-1 rounded-md hover:bg-[#2c2c2c] duration-300"
        >
          {" "}
          <MoveLeft />
          Go back
        </button>
        <div className="flex items-center space-x-1 text-base font-medium text-gray-400">
          <h1 className="capitalize text-nowrap">{category}</h1>
          <p>by</p>
          <Link
            to={`/profile/${username}`}
            className=" hover:text-gray-200 px-4 pl-3 py-2 flex items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300 duration-300 hover:bg-[#a5a5a511]"
          >
            <img
              src={profile_img}
              alt="profile"
              className="w-6 h-6 rounded mr-2"
            />
            <span className="whitespace-nowrap">{username}</span>
          </Link>
        </div>
      </div>
      <div className="max-h-[calc(100vh-10rem)] w-[calc(100vw-250px)] px-4">
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
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-700 text-white"
                }`}
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          <div className="w-1/2 h-[calc(100vh-10rem)] md:w-1/2 pl-2">
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
            <div className=" h-[calc(100vh-12.3rem)] border border-[#212121] pt-2 rounded-b-lg rounded-r-lg overflow-hidden bg-[#71717111]">
              <MonacoEditor
                height="100%"
                language={activeTab}
                theme="vs-dark"
                value={activeTab === "html" ? htmlCode : cssCode}
                options={{
                  minimap: { enabled: false },
                  readOnly: true,
                  smoothScrolling: true,
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
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-2 h-full flex-wrap min-h-[40px]">
            <div className="text-sm text-gray-400">
              <h1>Created at:</h1>
              <p className="text-gray-300">
                {Date(createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>
            </div>

            <div className={` justify-end items-stretch gap-2 ${post.status === 'under review' ? ' flex ' : ' hidden '}`}>
              <button
                onClick={handleReject}
                className="px-4 py-2.5 font-sans hidden sm:flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-300 bg-red-600 hover:bg-red-600/80 text-offwhite cursor-pointer"
              >
                <Ban />
                Reject
              </button>
              <button
                onClick={(handleApprove)}
                className=" px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-sm font-semibold transition-colors duration-300 cursor-pointer text-white bg-green-600 hover:bg-green-600/80 whitespace-nowrap"
              >
                <Check />
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
      {
        approveModal ? <ApproveModal post={post} setApproveModal={setApproveModal} approveModal={approveModal}/> : (rejectModal ? <PostRejectAlert postId={postId} rejectmodal={rejectModal} setRejectModal={setRejectModal}/> : ' ')
      }
    </AnimationWrapper>
  );
}

export default AdminPostDetails;
