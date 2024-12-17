import {
  BadgeX,
  Ban,
  Bookmark,
  BookMarked,
  Calendar,
  Check,
  CheckIcon,
  Clipboard,
  Moon,
  MoveLeft,
  Scale,
  ShieldAlert,
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
import { UserContext } from "../../App";
import Sidebar from "../components/sidebar";
import ClipLoader from "react-spinners/ClipLoader";
import { getDay, getFullDay } from "../../common/date";
import Comments from "../components/comments";
import ReportModal from "../components/report-modal";

export const postDataStructure = {
  _id: "",
  category: "",
  createdAt: "",
  cssCode: "",
  theme: "",
  htmlCode: "",
  postId: "",
  views: 0,
  saved: 0,
  status: "",
  tags: [],
  publishedAt: "",
  user: { personal_info: {} },
};

function PostDetails() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(postDataStructure);
  const [activeTab, setActiveTab] = useState("html");
  const previewRef = useRef(null);
  const shadowRootRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  let {postId} = useParams();

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let {
    _id,
    category,
    htmlCode,
    cssCode,
    views,
    theme,
    tags,
    user: {
      personal_info: { username, profile_img, fullname },
    },
    publishedAt,
  } = post;

  const fetchPostDetails = () => {
    setLoading(true);

    axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/get-post",
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

  const [backgroundColor, setBackgroundColor] = useState(
    theme === "light" ? "#e8e8e8" : "#212121"
  );

  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const fetchLoggedUser = async () => {
    if (access_token) {
      await axios
        .get(process.env.REACT_APP_SERVER_DOMAIN + "/logged-user", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          setUser(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchLoggedUser();
  }, [access_token]);

  useEffect(() => {
    if (user && Array.isArray(user.saved_post)) {
      setIsSaved(user.saved_post.includes(post._id));
    }
  }, [post._id, user]);

  const toggleSave = async () => {
    setLoading(true);
    if (!user) {
      alert("Please log in to save the post");
      return;
    }
    await axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/toggle-save-post",
        { postId: post._id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => {
        setIsSaved(response.data.isSaved);
        post.saved = response.data.isSaved ? post.saved + 1 : post.saved - 1;
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error toggling save status:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const handleHtmlChange = (newValue) => {
    setPost((prevPost) => ({
      ...prevPost,
      htmlCode: newValue,
    }));
  };

  const handleCssChange = (newValue) => {
    setPost((prevPost) => ({
      ...prevPost,
      cssCode: newValue,
    }));
  };

  useEffect(() => {
    if (previewRef.current && !shadowRootRef.current) {
      shadowRootRef.current = previewRef.current.attachShadow({ mode: "open" });
    }

    if (shadowRootRef.current) {
      // Update shadow root content when HTML or CSS changes
      shadowRootRef.current.innerHTML = `
        <style>
          * {
            transition: background-color 0.5s, color 0.5s;
            margin: 0;
            padding: 0;
            color: #000;
          }
          ${post.cssCode}
        </style>
        <div>${post.htmlCode}</div>
      `;
    }
  }, [post.htmlCode, post.cssCode, backgroundColor, isDarkMode]);

  const handleGoBack = () => {
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
      navigate(-1);
    }, 500);
  };

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

  const copyToClipboard = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      navigator.clipboard
        .writeText(code)
        .then(() => setCopied(true))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  useEffect(() => {
    setCopied(false);
  }, [activeTab]);

  // Determine text color based on luminance
  const textColor = getLuminance(backgroundColor) < 0.5 ? "white" : "black";

  const handleCloseBtn = () => {
    setReportModal(false);
  }

  return (
    <AnimationWrapper>
      <Toaster />
      <LoadingBar
        color="red"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="h-full flex rounded-b-3xl relative max-w-[2200px] m-auto px-[20px] w-full overflow-clip shadow-b-lg">
        {/* Sidebar */}
        <div className="z-0 h-[calc(100vh_-_60px)] mr-4 sticky top-0 pt-2 pb-4 hidden xl:block">
          <div className="w-[200px] flex flex-col h-full">
            <Sidebar />
          </div>
        </div>

        <main className="w-full h-full">
          <div className="flex justify-between items-center px-4 py-1">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1 hover:bg-[#212121] p-2 rounded-md duration-300"
            >
              {" "}
              <MoveLeft width={25} />
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
                  alt={username}
                  className="w-6 h-6 rounded mr-2"
                />
                <span className="whitespace-nowrap">{username}</span>
              </Link>
            </div>
          </div>
          <div className="min-h-[calc(100vh-10rem)] w-full px-4">
            <div className="flex flex-col-reverse md:flex-row bg-[#28282811]">
              <div
                style={{ backgroundColor: backgroundColor }}
                className={`flex relative rounded-md w-full md:w-1/2 left-0 top-0 py-10 overflow-hidden h-[calc(100vh-11rem)]`}
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
                      isDarkMode
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                </div>
              </div>

              <div className="w-1/2 h-[calc(100vh-11rem)] md:w-1/2 pl-2">
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
                <div className=" h-[calc(100vh-13.3rem)] relative border border-[#212121] rounded-b-lg rounded-r-lg overflow-hidden bg-[#71717111]">
                  <MonacoEditor
                    height="100%"
                    language={activeTab}
                    theme="vs-dark"
                    value={activeTab === "html" ? htmlCode : cssCode}
                    onChange={
                      activeTab === "html" ? handleHtmlChange : handleCssChange
                    }
                    options={{
                      minimap: { enabled: false },
                      copyWithSyntaxHighlighting: true,
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
                    onMount={handleEditorDidMount}
                  />
                  <button
                    onClick={copyToClipboard}
                    className=" flex gap-1 items-center absolute top-1 bg-opacity-50 right-3  py-1 w-20 justify-center rounded text-center bg-[#434343] font-semibold"
                  >
                    <Clipboard width={15} />
                    {copied ? <CheckIcon width={20} /> : "Copy"}
                  </button>
                </div>
              </div>
            </div>
            <div className="items-stretch mt-2 py-2 px-6 col-span-full bg-[#212121] rounded-xl md:block">
              <div className="flex flex-col items-center md:flex-row justify-between gap-2 h-full flex-wrap min-h-[35px]">
                <div className="text-base flex items-center gap-4 text-center text-gray-400">
                  <h1>{views} views</h1>
                  <button
                    className="flex hover:bg-dark-500 bg-transparent p-2 text-sm gap-2 text-gray-300 cursor-pointer transition-colors  font-sans font-semibold border-none items-center overflow-hidden rounded-md hover:bg-[#303030]"
                    onClick={toggleSave}
                  >
                    {loading ? (
                      <ClipLoader size={20} />
                    ) : isSaved ? (
                      <BookMarked size={20} className="text-yellow-500" />
                    ) : (
                      <Bookmark size={20} />
                    )}
                    {post.saved} <p className="text-base">Save to favourites</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 mt-10 px-4">
            <div>
              {/* <Comments post={post}/> */}
              <Comments post={post} />
              <div className="lg:max-w-2xl max-w-[70%] md:max-w-full mt-10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center gap-2 text-gray-400">
                     <Scale width={25}/>
                      MIT License
                    </span>
                  </div>
                  <textarea
                    name=""
                    id=""
                    cols="10"
                    rows="5"
                    className="w-full p-6 text-base text-gray-300 border-none resize-none bg-[#212121] custom-scrollbar rounded-xl"
                    readOnly
                    value={`Copyright - 2024 ${post.user.personal_info.fullname} (${post.user.personal_info.username}) \n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`}
                  />
                </div>
            </div>
            
            <div>
              <aside>
                <div className="">
                  <h2 className="mb-2 text-2xl font-bold text-gray-100 font-display capitalize max-w-[300px]">
                    {category.slice(0, category.length - 1)}
                  </h2>
                  <div className="flex flex-wrap gap-y-0 gap-x-2 text-gray-300 max-w-[300px]">
                    {tags.map((tag, index) => (
                      <a
                        key={index}
                        className="hover:underline underline-offset-2"
                        data-discover="true"
                        href="/tags/gradient"
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2"></div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                    <div className="flex items-center gap-3 font-normal text-gray-400">
                      <Calendar />
                      {getFullDay(publishedAt)}
                    </div>
                    <button onClick={() => setReportModal(true)} className="px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-base font-semibold transition-colors duration-300 bg-transparent hover:bg-[#212121] max-md:bg-[#212121] text-offwhite cursor-pointer group">
                      <ShieldAlert className="text-red-500" />
                      <span className="text-gray-400 group-hover:text-gray-200">
                        Report
                      </span>
                    </button>
                  </div>
                  <div className="w-full h-[2px] bg-dark-500 mb-6 mt-4"></div>
                </div>
                <section className="rounded-xl md:pr-8 max-w-full md:w-[300px] xl:w-[350px] mb-6">
                  <div className="grid grid-cols-[48px_1fr] gap-4 content-start">
                    <Link
                      to={`/profile/${username}`}
                      className=""
                      data-discover="true"
                    >
                      <img
                        src={profile_img}
                        alt={username}
                        className="w-12 h-12 rounded-lg"
                      />
                    </Link>
                    <div className="max-w-full overflow-hidden">
                      <Link
                        className="block text-xl font-semibold text-gray-200 truncate overflow-hidden"
                        data-discover="true"
                        to={`/profile/${username}`}
                      >
                        {username}
                      </Link>
                      <p className="block text-gray-400">{fullname}</p>
                    </div>
                    <p className="block text-gray-200 col-span-full text-base"></p>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>

      {
        reportModal && access_token && (
          <ReportModal postId={postId} access_token={access_token} handleCloseBtn={handleCloseBtn}/>
        )
      }
    </AnimationWrapper>
  );
}

export default PostDetails;
