import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  UserRound,
  BookMarked,
  MessageCircle,
  LogOut,
  Bolt,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import UserAuthentication from "./user-authentication";
import { UserContext } from "../../App";
import { removeFromSession } from "../../common/session";
import ElementSelection from "./category";
import LoadingBar from "react-top-loading-bar";
import CategoryDropdown from "./category-dropdown";
import ContributorPoint from "./contributor-point";

function NavbarComponent() {
  const [authOpen, setAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [contributor, setContributor] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [progress, setProgress] = useState(0);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const contributorRef = useRef(null)
  let {
    userAuth: { access_token, username, profile_img, contributor_points },
    setUserAuth,
  } = useContext(UserContext);
  const navigate = useNavigate(); // to programmatically navigate

  useEffect(() => {
    const closeOnEscapeKey = (e) =>
      e.key === "Escape" ? setAuthOpen(false) : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (authOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [authOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCloseBtn = () => {
    setAuthOpen(false);
  };

  const handleLogout = () => {
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
      removeFromSession("user");
      setUserAuth({ access_token: null });
    }, 1000);
  };

  // Add handler for link clicks
  const handleLinkClick = (path) => {
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
      navigate(path); // Navigate after the progress is updated
    }, 500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
      if (contributorRef.current && !contributorRef.current.contains(event.target)) {
        setContributor(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-dark-700 dark ">
      <LoadingBar
        color="red"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <nav className="flex items-center justify-between px-4  py-2">
        <div className="flex items-center space-x-8">
          <Link
            to=""
            onClick={() => handleLinkClick("/")}
            className="text-xl font-bold"
          >
            <span className="text-purple-500">UI</span>Nation
          </Link>
          <div className="hidden md:flex space-x-2 font-semibold text-[16px]">
            <div
              className="relative overflow-visible"
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
              ref={dropdownRef}
            >
              <button
                className={`flex items-center rounded-md px-4 py-2 hover:bg-[#212121] duration-300`}
                onClick={() => handleLinkClick("/elements")}
              >
                Elements <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {dropdown ? (
                <CategoryDropdown />
              ) : (
                ""
              )}
            </div>
            <button
              className="rounded-md px-4 p-2 hover:bg-[#212121] duration-300"
              onClick={() => handleLinkClick("/spotlight")}
            >
              Spotlight
            </button>
            <button
              className="rounded-md px-4 p-2 hover:bg-[#212121] duration-300"
              onClick={() => handleLinkClick("/blog")}
            >
              Blog
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          
        <div
              className="relative overflow-visible"
              onMouseEnter={() => setContributor(true)}
              onMouseLeave={() => setContributor(false)}
              ref={dropdownRef}
            >
              <button
                className={`flex cursor-auto bg-[#212121] items-center rounded-md px-4 py-2 hover:bg-[#212121] duration-300`}
                onClick={() => handleLinkClick("/elements")}
              >
              <Bolt /> <p className="ml-2">{contributor_points}</p>
              </button>
              {contributor ? (
                <ContributorPoint
                />
              ) : (
                ""
              )}
            </div>

          <Link
            to=""
            onClick={() => handleLinkClick("/create")}
            className="bg-purple-600 hover:shadow-2xl text-center w-24 py-[6px] rounded-md duration-300 flex justify-evenly items-center font-semibold"
          >
            <p className="text-xl">+</p> <p>Create</p>
          </Link>
          {!access_token ? (
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-[#212121] px-4 py-2 font-bold rounded-md"
            >
              Sign In or Create Account
            </button>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center bg-[#a5a5a511] hover:bg-[#212121] transition-colors h-[42px] py-0 px-1 rounded-lg pl-3 font-semibold"
              >
                <ChevronDown />
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {username}
                </div>
                <img
                  src={profile_img}
                  alt={username}
                  className="object-cover ml-3 mr-0 rounded-md w-9 h-9"
                />
              </button>
              {isMenuOpen && (
                <nav className="rounded-lg absolute top-[45px] right-0 z-50 p-1 shadow-xl bg-[#212121] border-2 border-[#212121] transition-all duration-500 translate-y-[5px]">
                  <ul className="p-0 m-0 list-none">
                    <li>
                      <Link
                        to={`/profile/${username}`}
                        className=" hover:text-gray-100 px-5 pl-3 py-2.5 flex items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300 hover:bg-[#a5a5a511]"
                        onClick={() => handleLinkClick(`/profile/${username}`)}
                      >
                        <UserRound className="w-5 h-5 mr-2" />
                        <span className="whitespace-nowrap">Your Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to=""
                        className=" hover:text-gray-100  px-5 pl-3 py-2.5 flex items-center justify-start border-none cursor-pointer w-full text-center text-sm font-medium m-0 whitespace-nowrap rounded-[6px] text-gray-300 hover:bg-[#a5a5a511]"
                        onClick={() => handleLinkClick("/favorites")}
                      >
                        <BookMarked className="h-[18px] w-[18px] mr-2" />
                        <span className="whitespace-nowrap">
                          Your Favorites
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to=""
                        target="_blank"
                        className="hover:text-gray-100  px-5 pl-3 py-2.5 flex items-center justify-start border-none cursor-pointer w-full text-center text-sm font-medium m-0 whitespace-nowrap rounded-[6px] text-gray-300 hover:bg-[#a5a5a511]"
                        onClick={() => handleLinkClick("/feedback")}
                      >
                        <MessageCircle className="h-[18px] w-[18px] mr-2" />
                        <span className="whitespace-nowrap">Send feedback</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to=""
                        target="_blank"
                        className=" hover:text-gray-100 px-5 pl-3 py-2.5 flex items-center justify-start w-full text-center text-sm font-medium my-1 rounded-[6px] text-gray-300 hover:bg-[#4955d6] bg-[#5865f2] transition-all duration-300"
                      >
                        <svg
                          width="33"
                          height="27"
                          className="mr-2 w-5 h-5 text-offwhite"
                          viewBox="0 0 33 27"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M27.9541 2.81323C25.818 1.81378 23.5339 1.08742 21.146 0.673828C20.8527 1.20404 20.5101 1.91719 20.2739 2.4845C17.7354 2.10275 15.2203 2.10275 12.7286 2.4845C12.4924 1.91719 12.142 1.20404 11.8461 0.673828C9.45561 1.08742 7.16891 1.81645 5.03277 2.81853C0.724134 9.32943 -0.443865 15.6786 0.140135 21.9377C2.52323 23.5624 4.82692 24.5369 7.08278 25.1861C7.68078 24.3858 8.21499 23.5344 8.6736 22.6531C7.783 22.3451 6.929 21.9486 6.1126 21.4705C6.2895 21.3425 6.46636 21.2077 6.6375 21.0661C11.4561 23.3982 17.1562 23.3982 21.9279 21.0661C22.1023 21.2077 22.2791 21.3425 22.456 21.4705C21.6396 21.9486 20.7856 22.3451 19.895 22.6531C20.3646 23.5344 20.8988 24.3892 21.4904 25.189C23.7495 24.5397 26.0532 23.5653 28.4363 21.9377C29.0721 15.9615 27.2702 9.61889 27.9541 2.81323Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>Join us on Discord</span>
                      </Link>
                    </li>
                    <li>
                      <button
                        className="hover:text-gray-100 px-5 pl-3 py-2.5 flex items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300 hover:bg-[#a5a5a511]"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        <span>Log out</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          )}
        </div>
      </nav>
      {authOpen ? <UserAuthentication handleCloseBtn={handleCloseBtn} /> : ""}
      {isCreate ? (
        access_token ? (
          <ElementSelection />
        ) : (
          <UserAuthentication handleCloseBtn={handleCloseBtn} />
        )
      ) : (
        ""
      )}
      <Outlet />
    </div>
  );
}

export default NavbarComponent;
