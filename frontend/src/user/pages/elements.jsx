import React, { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  BookMarked,
  ArrowRight,
  ArrowLeft,
  SunMoon,
} from "lucide-react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import PostCard from "../components/post-card";
import Sidebar from "../components/sidebar";
import AnimationWrapper from "../../common/page-animation";
import LoadingBar from "react-top-loading-bar";
import toast from "react-hot-toast";
import Footer from "../components/footer";
import { UserContext } from "../../App";

export default function Elements() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sort, setSort] = useState("randomized");
  const [theme, setTheme] = useState("any");
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(0);
  const sortButtonRef = useRef(null);
  const themeButtonRef = useRef(null);
  const sortMenuRef = useRef(null);
  const themeMenuRef = useRef(null);
  let { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const page = parseInt(queryParams.get("page") || "1", 10);
  const limit = parseInt(queryParams.get("limit") || "20", 10);
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  const handleSearchChange = (e) => {
    e.preventDefault();
    const newSearch = search;
    queryParams.delete("category");
    queryParams.set("search", newSearch);
    navigate(`/elements?${queryParams.toString()}`);
  };

  if (category == "elements") {
    category = "";
  }

  const fetchPosts = () => {
    setProgress(70);
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/explore-post", {
        category,
        query: searchQuery.toString(),
        page,
        sort,
        theme,
        limit,
      })
      .then(({ data }) => {
        setProgress(100);
        setPosts(data.posts);
      })
      .catch((err) => {
        toast.error("something went wrong");
        setProgress(100);
      });
  };

  const fetchPostCount = () => {
    axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/explore-post-count", {
        category,
        query: searchQuery.toString(),
        sort,
        page,
        limit,
      })
      .then(({ data }) => {
        setTotalPosts(data.totalDocs);
      });
  };

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
    fetchPosts();
    fetchPostCount();
  }, [category, location.search, searchQuery, sort, limit, page, theme]);

  const handleClickOutside = (event) => {
    if (
      sortMenuOpen &&
      sortMenuRef.current &&
      !sortMenuRef.current.contains(event.target) &&
      !sortButtonRef.current.contains(event.target)
    ) {
      setSortMenuOpen(false);
    }

    if (
      themeMenuOpen &&
      themeMenuRef.current &&
      !themeMenuRef.current.contains(event.target) &&
      !themeButtonRef.current.contains(event.target)
    ) {
      setThemeMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortMenuOpen, themeMenuOpen]);

  const handlePageChange = (newPage) => {
    queryParams.set("page", newPage);
    navigate(`?${queryParams.toString()}`);
  };

  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <AnimationWrapper>
      <LoadingBar
        color="#7781b7"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="flex rounded-b-3xl relative max-w-[2200px] m-auto py-0 px-[20px] w-full overflow-clip shadow-b-lg mb-12">
        {/* Sidebar */}
        <div className="z-0 h-[calc(100vh_-_60px)] mr-4 sticky top-14 pt-7 pb-4 hidden xl:block ">
          <div className="w-[200px] flex flex-col h-full ">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <main className="w-full">
          <div className="pt-3.5 pb-2.5 z-40 relative justify-between items-end flex-wrap">
            <div className="w-full">
              <div className="items-center justify-between  gap-2 filters max-lg:items-end flex">
                <h1 className="text-sm font-medium text-zinc-400 whitespace-nowrap hidden sm:block">
                  Page {page}
                </h1>

                <div className="flex justify-end items-center flex-wrap gap-1 gap-y-2 ">
                  <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

                  {/* Sort */}
                  <motion.div
                    className="max-w-2xl mx-auto relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <button
                      ref={sortButtonRef}
                      onClick={() => setSortMenuOpen(!sortMenuOpen)}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium  hover:bg-[#212121] hover:text-white duration-300 ${
                        sortMenuOpen
                          ? "bg-[#212121] text-white "
                          : "text-zinc-400"
                      }`}
                    >
                      <SlidersHorizontal className="h-4 w-4 capitalize" />
                      Sort:{" "}
                      <p className="capitalize">
                        {sort === "saved"
                          ? "favourite"
                          : sort === "createdAt"
                          ? "Recent"
                          : sort}
                      </p>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {sortMenuOpen && (
                      <AnimationWrapper transition={0.2}>
                        <div
                          ref={sortMenuRef}
                          className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md border border-zinc-800 bg-[#121212] py-1 shadow-lg"
                        >
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                            onClick={() => setSort("randomized")}
                          >
                            Randomized
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                            onClick={() => setSort("saved")}
                          >
                            Favourites
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                            onClick={() => setSort("views")}
                          >
                            Views
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                            onClick={() => setSort("createdAt")}
                          >
                            Recent
                          </button>
                        </div>
                      </AnimationWrapper>
                    )}
                  </motion.div>

                  {/* Theme */}
                  <motion.div
                    className="max-w-2xl mx-auto relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <button
                      ref={themeButtonRef}
                      onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                      className={`flex items-center gap-2 rounded-xl px-3 duration-300 capitalize py-2 text-sm font-medium hover:bg-[#212121] hover:text-white ${
                        themeMenuOpen
                          ? "bg-[#212121] text-white "
                          : "text-zinc-400"
                      }`}
                    >
                      <SunMoon className="w-4 h-4"/>
                      Theme:{" "}
                      <p className="capitalize">
                        {theme}
                      </p>
                      <ChevronDown className="h-4 w-4 " />
                    </button>
                    {themeMenuOpen && (
                      <AnimationWrapper transition={0.2}>
                        <div
                          ref={themeMenuRef}
                          className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md border duration-300 transition-all border-zinc-800 bg-[#121212] py-1 shadow-lg"
                        >
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                            onClick={() => setTheme("light")}
                          >
                            Light
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                            onClick={() => setTheme("dark")}
                          >
                            Dark
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white"
                            onClick={() => setTheme("any")}
                          >
                            Any Theme
                          </button>
                        </div>
                      </AnimationWrapper>
                    )}
                  </motion.div>

                  {/* Search */}
                  <motion.div
                    className="max-w-2xl mx-auto relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <input
                      className=" px-6 py-2 rounded-xl placeholder:text-sm lg:w-64 lg:placeholder:text-base max-w-64 focus:bg-white/10 bg-[#1b1b1b] border focus:border-white/20 duration-300 border-[#161616] outline-none focus:outline-none transition-all text-white placeholder-gray-400"
                      placeholder="Search tags, users, posts..."
                      type="text"
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearchChange(e);
                        }
                      }}
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hidden sm:block" />
                  </motion.div>
                  
                </div>
              </div>
            </div>
          </div>

          <section className="grid gap-y-5 gap-x-3.5 content-stretch items-stretch w-full mb-24 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5">
            {posts.map((item, index) => (
              <PostCard post={item} user={user} key={index} />
            ))}
          </section>

          {/* Pagination Controls */}
          <div className="pagination-controls flex gap-2 items-center justify-between">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-4 w-[30%] py-2 text-[18px] font-medium gap-1 flex text-white items-center bg-[#6d6d6d11] hover:bg-[#87868611] duration-300 rounded justify-start disabled:opacity-0"
            >
              <ArrowLeft />
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-4 w-[30%] py-2 text-[18px] font-medium gap-1 text-white flex items-center bg-[#6d6d6d11] hover:bg-[#87868611] duration-300 rounded justify-end disabled:opacity-0"
            >
              Next
              <ArrowRight />
            </button>
          </div>
        </main>
      </div>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMTMxMzEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
      </div>
      <Footer />
    </AnimationWrapper>
  );
}
