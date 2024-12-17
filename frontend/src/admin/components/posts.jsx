import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../App";
import {
  Ban,
  CheckCheck,
  Cross,
  Loader,
  Loader2,
  WrenchIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminPostCard from "./post-card";
import LoadingBar from "react-top-loading-bar";

export default function AdminPost() {
  let {
    adminAuth,
    adminAuth: { access_token },
  } = useContext(AdminContext);
  const [activeTab, setActiveTab] = useState("under review");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const fetchPosts = () => {
    if (!access_token) return;
    setProgress(70);
    setLoading(true);

    axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/admin/posts",
        {status: activeTab},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setProgress(100);
        console.log(data);
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        setProgress(100);
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [access_token, activeTab]);

  return (
    <>
     <div className=" w-[calc(100vw-250px)] min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
     <LoadingBar
        color="#7781b7"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
        <h1 className="text-2xl font-bold mb-4">User Posts</h1>
        <div className="flex border-b border-gray-600">
          <nav className="flex gap-1">
            <button
              className={`py-2 px-4 text-center text-yellow-500 font-medium text-base flex gap-2 duration-300 rounded ${
                activeTab === "under review"
                  ? "bg-gray-800"
                  : "  hover:bg-gray-900"
              }`}
              onClick={() => setActiveTab("under review")}
            >
              <Loader />
              Under Review
            </button>
            <button
              className={` py-2 px-4 text-center text-green-500 font-medium text-base rounded flex gap-2 duration-300 ${
                activeTab === "published"
                 ? "bg-gray-800"
                  : "  hover:bg-gray-900"
              }`}
              onClick={() => setActiveTab("published")}
            >
              <CheckCheck />
              Published Posts
            </button>
            <button
              className={` py-2 px-4 text-center text-red-500 font-medium text-base rounded flex gap-2 duration-300 ${
                activeTab === "rejected"
                 ? "bg-gray-800"
                  : "  hover:bg-gray-900"
              }`}
              onClick={() => setActiveTab("rejected")}
            >
              <Ban />
              Rejected Posts
            </button>
          </nav>
        </div>
        {activeTab === "under review" ? (
          <div className="mt-4 grid gap-y-5 gap-x-3.5 content-stretch items-stretch w-full mb-24 lg:grid-cols-3 md:grid-cols-2 max-xs:gap-2.5 grid-cols-elements">
            {posts.map((item, index) => (
              <article
                key={index}
                className="relative isolate flex flex-col text-black h-full overflow-hidden rounded-md"
              >
                <div className="relative min-h-[250px] max-h-[520px] rounded-md bg-gray-200 overflow-hidden flex-grow ">
                  <AdminPostCard key={index} item={item} />
                </div>
              </article>
            ))}
          </div>
        ) : activeTab === "published" ? (
          <div className="mt-4 grid gap-y-5 gap-x-3.5 content-stretch items-stretch w-full mb-24 lg:grid-cols-3 md:grid-cols-2 max-xs:gap-2.5 grid-cols-elements">
            {posts.map((item, index) => (
              <article
                key={index}
                className="relative isolate flex flex-col text-black h-full overflow-hidden rounded-md"
              >
                <div className="relative min-h-[250px] max-h-[520px] rounded-md bg-gray-200 overflow-hidden flex-grow ">
                  <AdminPostCard key={index} item={item} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-y-5 gap-x-3.5 content-stretch items-stretch w-full mb-24 lg:grid-cols-3 md:grid-cols-2 max-xs:gap-2.5 grid-cols-elements">
            {posts.map((item, index) => (
              <article
                key={index}
                className="relative isolate flex flex-col text-black h-full overflow-hidden rounded-md"
              >
                <div className="relative min-h-[250px] max-h-[520px] rounded-md bg-gray-200 overflow-hidden flex-grow ">
                  <AdminPostCard key={index} item={item} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
