"use client";

import axios from "axios";
import { CodeXml } from "lucide-react";
import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "../../App";
import toast from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";

export default function ApproveModal({ post, setApproveModal, approveModal }) {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [progress, setProgress] = useState(0);

  let {
    adminAuth: { access_token },
  } = useContext(AdminContext);

  const previewRef = useRef(null); // Ref for the div that will hold the shadow DOM
  const shadowRootRef = useRef(null); // Ref for the shadow root

  const handleApprove = async () => {
    setProgress(70);
    await axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/admin/update-post",
        { postId: post.postId, status: "published", tags: tags },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(() => {
        setProgress(100);
        toast.success("success");
        setApproveModal(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setProgress(100);
      });
  };

  useEffect(() => {
    // Check if the previewRef is available
    if (previewRef.current) {
      // Create the shadow root if it hasn't been created yet
      if (!shadowRootRef.current) {
        shadowRootRef.current = previewRef.current.attachShadow({
          mode: "open",
        });
      }
      const shadowRoot = shadowRootRef.current;

      shadowRoot.innerHTML = `
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                    }
                    ${post.cssCode}
                </style>
                <div>${post.htmlCode}</div>
            `;
    }
  }, [post.htmlCode, post.cssCode]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setApproveModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (!approveModal) return null;

  return (
    <div className="fixed z-[1000] inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
      <LoadingBar
        color="red"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="bg-[#212121] rounded-2xl shadow-2xl max-w-4xl w-full min-h-[420px] overflow-hidden transform transition-all duration-300 ease-in-out flex justify-center items-center">
        <div></div>
        <div className="w-full h-full flex flex-col md:flex-row justify-center items-center">
          <article className="mx-10 space-y-2 h-full w-1/2 overflow-hidden rounded-md">
            <div className="flex items-center space-x-1 text-base font-medium text-gray-400">
              <h1 className="capitalize text-nowrap">{post.category}</h1>
              <p>by</p>
              <Link
                to={`/profile/${post.user.personal_info.username}`}
                className=" hover:text-gray-200 px-4 pl-3 py-2 flex items-center cursor-pointer text-center text-sm font-medium rounded-[6px] text-gray-300 duration-300 hover:bg-[#a5a5a511]"
              >
                <img
                  src={post.user.personal_info.profile_img}
                  alt="profile"
                  className="w-6 h-6 rounded mr-2"
                />
                <span className="whitespace-nowrap">
                  {post.user.personal_info.username}
                </span>
              </Link>
            </div>
            <div className=" min-h-[250px] max-h-[520px] rounded-md bg-[#e8e8e8] overflow-hidden flex-grow">
              <div className="h-full w-full flex justify-center items-center overflow-hidden">
                <div className="z-50" ref={previewRef} />
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <h1>Created at:</h1>
              <p className="text-gray-300">
                {Date(post.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>
            </div>
          </article>
          <div className="w-1/2 rounded-md h-full flex flex-col justify- mx-4">
            <div className="w-full h-full">
              <label
                htmlFor="tags"
                className="block text-sm font-semibold text-gray-500 mb-1"
              >
                Tags
              </label>

              <div className="relative p-2 pb-4 bg-[#a5a5a511] rounded-md">
                <input
                  type="text"
                  id="tags"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddTag();
                    }
                  }}
                  className="sticky bg-[#212121] top-0 left-0 p-2 mb-4 outline-none focus:outline-[#3e3e3e] focus:outline-1 rounded-md w-full"
                />
                {tags.map((tag, i) => {
                  return (
                    <div className="relative p-1 mt-2 mr-2 px-4 bg-[#3e3e3e] rounded-full inline-block hover:bg-opacity-50 pr-8">
                      <p className="outline-none">{tag}</p>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="mt-[2px] rounded-full absolute right-2 top-1/2 -translate-y-1/2 "
                      >
                        <i className="fi fi-rr-cross-small text-xl pointer-events-none"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end space-x-3 absolute bottom-4 right-4">
              <button
                onClick={() => setApproveModal(false)}
                className="px-6 py-2 rounded-lg hover:bg-[#a5a5a511] transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600  transition-all duration-300"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
