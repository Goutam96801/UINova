import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  BookMarked,
  ArrowRight,
  ArrowLeft,
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
  const [theme, setTheme] = useState("any")
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
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
  let {userAuth: { access_token }} = useContext(UserContext);

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
        limit
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
    axios.post(process.env.REACT_APP_SERVER_DOMAIN + '/explore-post-count', {
      category,
      query: searchQuery.toString(),
      sort,
      page,
      limit
    }).then(({data}) => {
      setTotalPosts(data.totalDocs)
    })
  }

  const fetchLoggedUser = async () => {

    if(access_token){
    await axios.get(process.env.REACT_APP_SERVER_DOMAIN + "/logged-user", {
      headers:{
        Authorization:`Bearer ${access_token}`
      }
    }).then(({data}) => { 
      setUser(data);
    }).catch(err => {
      console.log(err);
    })
  }
  }

  useEffect(() => {
    fetchLoggedUser()
  }, [access_token]) 

  useEffect(() => {
    fetchPosts()
    fetchPostCount()
  },[category, location.search, searchQuery, sort, limit, page, theme])

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
        color="red"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="flex rounded-b-3xl relative max-w-[2200px] m-auto py-0 px-[20px] w-full overflow-clip shadow-b-lg mb-12">
        {/* Sidebar */}
        <div className="z-0 h-[calc(100vh_-_66px)] mr-4 sticky -top-3 pt-7 pb-4 hidden xl:block">
          <div className="w-[200px] flex flex-col h-full">
            <Sidebar />
          </div>
        </div>

        {/* Main Content */}
        <main className="w-full">
          <div className="pt-3.5 pb-2.5 z-50 relative justify-between items-end flex-wrap">
            <div className="w-full">
              <div className="items-center justify-between hidden gap-2 filters max-lg:items-end lg:flex">
                <h1 className="text-sm font-medium text-zinc-400 whitespace-nowrap">
                  Page {page}
                </h1>

                <div className="flex justify-end items-center flex-wrap gap-1 gap-y-2">
                  <div className="h-6 w-px bg-zinc-800" />

                  {/* Sort */}
                  <div className="relative">
                    <button
                      ref={sortButtonRef}
                      onClick={() => setSortMenuOpen(!sortMenuOpen)}
                      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium  hover:bg-[#212121] hover:text-white duration-300 ${sortMenuOpen ? 'bg-[#212121] text-white ':'text-zinc-400'}`}
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
                        <div ref={sortMenuRef} className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md border border-zinc-800 bg-[#121212] py-1 shadow-lg">
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
                  </div>

                  {/* Theme */}
                  <div className="relative">
                    <button
                      ref={themeButtonRef}
                      onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                      className={`flex items-center gap-2 rounded-md px-3 duration-300 capitalize py-1.5 text-sm font-medium hover:bg-[#212121] hover:text-white ${themeMenuOpen ? 'bg-[#212121] text-white ':'text-zinc-400'}`}
                    >
                      {theme}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {themeMenuOpen && (
                      <AnimationWrapper transition={0.2}>
                        <div ref={themeMenuRef} className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md border duration-300 transition-all border-zinc-800 bg-[#121212] py-1 shadow-lg">
                          <button className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white" onClick={() => setTheme("light")}>
                            Light
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white" onClick={() => setTheme("dark")}>
                            Dark
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-[#212121] hover:text-white" onClick={() => setTheme("any")}>
                            Any Theme
                          </button>
                        </div>
                      </AnimationWrapper>
                    )}
                  </div>

                  {/* Search */}
                  <div className="flex items-center gap-4 w-46 rounded-md bg-zinc-800 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700">
                    <form
                      className="flex items-center gap-2"
                      onSubmit={handleSearchChange}
                    >
                      <input
                        className="text-base font-medium text-white bg-transparent px-3 py-1.5 outline-none placeholder-zinc-400"
                        placeholder="Search tags, users, posts..."
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                      >
                        <Search className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="grid gap-y-5 gap-x-3.5 content-stretch items-stretch w-full mb-24 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5">
            {posts.map((item, index) => (
             <PostCard post={item} user={user} key={index}/>
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
      
      <Footer/>
    </AnimationWrapper>
  );
}