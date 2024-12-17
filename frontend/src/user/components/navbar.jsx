import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  UserRound,
  BookMarked,
  MessageCircle,
  LogOut,
  Bolt,
  X,
  Menu,
  User,
  Bell,
  MessageCircleCode,
  BellDot,
  Plus,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import UserAuthentication from "./user-authentication";
import { UserContext } from "../../App";
import { removeFromSession } from "../../common/session";
import ElementSelection from "./category";
import LoadingBar from "react-top-loading-bar";
import CategoryDropdown from "./category-dropdown";
import ContributorPoint from "./contributor-point";
import AnimationWrapper from "../../common/page-animation";
import Notifications from "./notification";
import axios from "axios";
import LogoImg from "../../assets/logo.png";

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const categories = [
  "browse all",
  "buttons",
  "checkboxes",
  "toggle switches",
  "cards",
  "loaders",
  "inputs",
  "radio buttons",
  "forms",
  "patterns",
  "AudioWaveform",
  "tooltips",
  "my favourites",
];

function NavbarComponent() {
  const [isHover, setIsHover] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(null);
  const [categoryShow, setCategoryShow] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [contributor, setContributor] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Update 1
  const dropdownRef = useRef(null);
  const contributorRef = useRef(null);
  const {
    userAuth: { access_token, username, profile_img, contributor_points },
    setUserAuth,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchNotificationCount = async () => {
      access_token &&
        (await axios
          .post(
            process.env.REACT_APP_SERVER_DOMAIN +
              "/all-unread-notifications-count",
            {},
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then(({ data }) => {
            setTotalNotifications(data.totalDocs);
            localStorage.setItem("totalNotifications", data.totalDocs);
          })
          .catch((err) => {
            console.log(err);
          }));
    };
    fetchNotificationCount();
  }, [access_token]);

  useEffect(() => {
    const closeOnEscapeKey = (e) =>
      e.key === "Escape" ? setAuthOpen(false) : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (authOpen || isMobileMenuOpen) {
      // Update 2
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [authOpen, isMobileMenuOpen]); // Update 2

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

  const handleLinkClick = (path) => {
    setProgress(70);
    setTimeout(() => {
      setProgress(100);
      navigate(path);
    }, 500);
  };

  return (
    <>
      <LoadingBar
        color="#7781b7"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
        className={`sticky top-0 left-0 right-0 h-[60px] flex items-center justify-between px-4 py-2 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
          isActive("/feature") ? " bg-gray-900 bg-opacity-50 " : ""
        }`}
      >
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, duration: 1 }}
          className="flex items-center space-x-8"
        >
          <Link
            to="/"
            onClick={() => handleLinkClick("/")}
            className="flex items-center p-3 py-0 xl:pr-10 lg:pr-8  2xl:pr-22 pr-5 translate-y-[2px] logo-wrapper"
          >
            <img className="logo max-w-[85px]" src={LogoImg} alt=""></img>
          </Link>
          <div className="hidden md:flex space-x-2 font-semibold text-[16px]">
            <div
              className="relative overflow-visible"
              onMouseEnter={() => setDropdown(true)}
              onMouseLeave={() => setDropdown(false)}
              ref={dropdownRef}
            >
              <button
                className={`flex items-center rounded-md px-4 py-2 hover:bg-[#212121] duration-300 ${
                  isActive("/elements") ? "bg-[#212121]" : ""
                }`}
                onClick={() => handleLinkClick("/elements")}
              >
                Elements <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {dropdown && <CategoryDropdown />}
            </div>
            <button
              className={`rounded-md px-4 p-2 hover:bg-[#212121] duration-300 ${
                isActive("/feature") ? "bg-gray-800 bg-opacity-50" : ""
              }`}
              onClick={() => handleLinkClick("/feature")}
            >
              Feature
            </button>
            <button
              className={`rounded-md px-4 p-2 hover:bg-[#212121] duration-300 ${
                isActive("/blog") ? "bg-[#212121]" : ""
              }`}
              onClick={() => handleLinkClick("/blog")}
            >
              Blog
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, duration: 1 }}
          className="hidden md:flex items-center space-x-4"
        >
          {access_token && (
            <div className="relative flex gap-2 right-2">
              <div
                className="relative overflow-visible "
                onMouseEnter={() => setContributor(true)}
                onMouseLeave={() => setContributor(false)}
                ref={contributorRef}
              >
                <button
                  className="flex cursor-auto bg-[#212121] items-center rounded-md px-4 py-2 hover:bg-[#212121] duration-300"
                  onClick={() => handleLinkClick("/elements")}
                >
                  <Bolt color="indigo" />{" "}
                  <p className="ml-2 font-medium">{contributor_points}</p>
                </button>
                {contributor && <ContributorPoint />}
              </div>
              <div>
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="flex cursor-auto bg-[#212121] items-center rounded-md px-4 py-2 hover:bg-[#212121] duration-300"
                >
                  <Bell />{" "}
                  {totalNotifications === "0" ? (
                    ""
                  ) : (
                    <p
                      className={`absolute text-xs top-0.5 right-3 text-purple-600 font-medium`}
                    >
                      {totalNotifications}
                    </p>
                  )}
                </button>
                {notificationOpen && (
                  <Notifications
                    totalNotifications={totalNotifications}
                    setTotalNotifications={setTotalNotifications}
                  />
                )}
              </div>
            </div>
          )}

          <div class="relative overflow-visible group">
            <div class="absolute -translate-y-28 rounded-full left-1/2 -translate-x-1/2 bg-gradient-to-tl from-indigo-500 to-fuchsia-500 blur-2xl w-[140px] duration-1000 h-[80px] group-hover:-translate-y-20 z-0 transition-transform"></div>
            <Link
              onClick={() => handleLinkClick("/create")}
              class="px-4 py-2.5 font-sans flex items-center gap-2 border-none rounded-lg text-sm font-semibold transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 text-offwhite cursor-pointer lg:flex button--create h-[42px] relative overflow-visible"
            >
              <Plus className="w-5 h-5" /> Create
            </Link>
          </div>
          {!access_token ? (
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-[#212121] px-4 py-2 font-bold rounded-md"
            >
              Sign In or Create Account
            </button>
          ) : (
            <motion.nav
              initial={false}
              animate={isMenuOpen ? "open" : "closed"}
              className="relative"
            >
              <motion.button
                className="flex items-center bg-[#a5a5a511] hover:bg-[#212121] transition-colors h-[42px] py-0 px-1 rounded-lg pl-3 font-semibold"
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <motion.div
                  variants={{
                    open: { rotate: 180 },
                    closed: { rotate: 0 },
                  }}
                  transition={{ duration: 0.2 }}
                  style={{ originY: 0.5 }}
                >
                  <ChevronDown />
                </motion.div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {username}
                </div>
                <img
                  src={profile_img}
                  alt={username}
                  className="object-cover ml-3 mr-0 rounded-md w-9 h-9"
                />
              </motion.button>
              <motion.ul
                className="rounded-lg absolute top-[45px] -right-2 z-50 p-1 shadow-xl bg-[#212121] border-2 border-[#212121] transition-all duration-500 translate-y-[5px]"
                variants={{
                  open: {
                    clipPath: "inset(0% 0% 0% 0% round 10px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.7,
                      delayChildren: 0.3,
                      staggerChildren: 0.05,
                    },
                  },
                  closed: {
                    clipPath: "inset(10% 50% 90% 50% round 10px)",
                    transition: {
                      type: "spring",
                      bounce: 0,
                      duration: 0.3,
                    },
                  },
                }}
                style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
              >
                <motion.li variants={itemVariants} whileHover={{ scale: 1.1 }}>
                  <Link
                    to={`/profile/${username}`}
                    className="hover:text-gray-100 px-5 pl-3 py-2.5 flex items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300"
                    onClick={() => handleLinkClick(`/profile/${username}`)}
                  >
                    <UserRound className="w-5 h-5 mr-2" />
                    <span className="whitespace-nowrap">Your Profile</span>
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants} whileHover={{ scale: 1.1 }}>
                  <Link
                    to="/favorites"
                    className="hover:text-gray-100 px-5 pl-3 py-2.5 flex items-center justify-start border-none cursor-pointer w-full text-center text-sm font-medium m-0 whitespace-nowrap rounded-[6px] text-gray-300"
                    onClick={() => handleLinkClick("/favorites")}
                  >
                    <BookMarked className="h-[18px] w-[18px] mr-2" />
                    <span className="whitespace-nowrap">Your Favorites</span>
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants} whileHover={{ scale: 1.1 }}>
                  <Link
                    to="https://discord.gg/KD8ba2uUpT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-100 px-5 pl-3 py-2 flex items-center justify-start w-full text-center text-sm font-medium my-1 rounded-[6px] text-gray-300 hover:bg-[#4955d6] bg-[#5865f2] transition-all duration-300"
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
                </motion.li>
                <motion.li variants={itemVariants} whileHover={{ scale: 1.1 }}>
                  <button
                    className="hover:text-gray-100 px-5 pl-3 py-2.5 flex items-center justify-start cursor-pointer w-full text-center text-sm font-medium rounded-[6px] text-gray-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span>Log out</span>
                  </button>
                </motion.li>
              </motion.ul>
            </motion.nav>
          )}
        </motion.div>

        <button
          className="flex md:hidden justify-center fixed right-2 z-50"
          style={{ background: "transparent" }}
          onClick={() => {
            setMobile(!mobile);
            setIsMobileMenuOpen(!isMobileMenuOpen); // Update 3
          }}
        >
          {mobile ? <X /> : <Menu />}
        </button>
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMTMxMzEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>
        </div>
      </motion.nav>

      <motion.div
        initial={false}
        animate={mobile ? "open" : "closed"}
        variants={{
          open: { opacity: 1, x: 0 },
          closed: { opacity: 0, x: "100%" },
        }}
        className={`fixed inset-0 z-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjEyMTIxIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMTMxMzEiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20 transform transition-transform duration-300 ease-in-out',
          ${mobile ? "translate-x-0" : "translate-x-full"} 
        `}
      >
        <div
          className={`fixed inset-0 top-[60px] w-screen h-[calc(100vh-64px)] overflow-y-auto z-40 ${
            isActive("/feature") ? " bg-gray-900 bg-opacity-50 " : ""
          }`}
        >
          {" "}
          {/* Update 4 */}
          <div className="min-h-full p-4">
            <div className="px-2 pt-2 pb-3 space-y-1 font-semibold">
              <button
                onClick={() => setCategoryShow(!categoryShow)}
                className={`${
                  categoryShow ? "bg-[#212121]" : ""
                } rounded-md py-2 px-3 text-base font-semibold w-full flex items-center justify-between text-gray-100`}
              >
                <span>Categories</span>
                <ChevronDown />
              </button>
              {categoryShow && (
                <AnimationWrapper transition={0.5}>
                  <div className="py-4 pt-2 pl-6 text-gray-300">
                    {categories.map((name, index) => (
                      <Link
                        key={index}
                        to={`/${name === "browse all" ? "elements" : name}`}
                        className={`text-gray-400 flex items-center py-2 px-3 rounded-lg capitalize ${
                          isActive(`/${name}`) ? "bg-[#212121]" : ""
                        }`}
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                </AnimationWrapper>
              )}
              <Link
                className={`text-gray-400 flex items-center py-2 px-3 rounded-lg ${
                  isActive("/challenges") ? "bg-[#212121]" : ""
                }`}
                onClick={() => handleLinkClick("/challenges")}
              >
                Challenges
              </Link>
              <Link
                className={`text-gray-100 flex items-center py-2 px-3 rounded-lg ${
                  isActive("/feature") ? "bg-gray-800 bg-opacity-50" : ""
                }`}
                onClick={() => handleLinkClick("/feature")}
              >
                Feature
              </Link>
              <Link
                className="text-gray-400 flex items-center py-2 px-3 rounded-lg"
                onClick={() => handleLinkClick("/blogs")}
              >
                Blog
              </Link>
            </div>
            {access_token ? (
              <div className="relative pt-4 pb-3 border-t border-[#2d2d2d]">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="object-cover rounded-md w-[46px] h-[46px]"
                      src={profile_img}
                      alt=""
                    />
                  </div>
                  <div className="flex items-center flex-1 gap-2 ml-3 font-semibold text-gray-50">
                    {username}
                  </div>
                  <button className="button button--notifications hover:bg-dark-600 rounded-lg button--secondary px-3 border-transparent relative false new">
                    <BellDot />
                  </button>
                </div>
                <ul className="px-2 py-3 mt-3 space-y-1 list-none border-b border-dark-500">
                  <li className="font-semibold">
                    <Link
                      className="text-gray-400 flex items-center gap-2 py-2 px-3 rounded-lg"
                      to={`/profile/${username}`}
                    >
                      <User />
                      <span>Your Profile</span>
                    </Link>
                  </li>
                  <li className="font-semibold">
                    <Link
                      to="https://docs.google.com/forms/d/e/1FAIpQLSfbaOoGw82eXhX1la80_NM-P9Pv0lzxE1nUF85lp89s7G7vOw/viewform?usp=sf_link"
                      className="flex items-center gap-2 px-3 py-2 text-gray-400 rounded-lg"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircleCode />
                      <span>Send feedback</span>
                    </Link>
                  </li>
                  <li className="font-semibold">
                    <Link
                      to="https://discord.gg/KD8ba2uUpT"
                      className="flex items-center gap-2 px-3 py-2 text-gray-400 rounded-lg"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        width="33"
                        height="27"
                        className="w-5 h-5"
                        viewBox="0 0 33 27"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.9541 2.81323C25.818 1.81378 23.5339 1.08742 21.146 0.673828C20.8527 1.20404 20.5101 1.91719 20.2739 2.4845C17.7354 2.10275 15.2203 2.10275 12.7286 2.4845C12.4924 1.91719 12.142 1.20404 11.8461 0.673828C9.45561 1.08742 7.16891 1.81645 5.03277 2.81853C0.724134 9.32943 -0.443865 15.6786 0.140135 21.9377C2.99785 24.0717 5.76731 25.3681 8.49004 26.2164C9.1623 25.2912 9.76186 24.3077 10.2784 23.2711C9.29466 22.8973 8.35248 22.4361 7.46223 21.9006C7.69841 21.7256 7.92943 21.5426 8.15262 21.3544C13.5825 23.8941 19.4822 23.8941 24.8473 21.3544C25.0731 21.5426 25.3041 21.7256 25.5377 21.9006C24.6448 22.4387 23.7 22.9 22.7163 23.2738C23.2328 24.3077 23.8298 25.2939 24.5046 26.219C27.23 25.3707 30.002 24.0744 32.8597 21.9377C33.545 14.6818 31.6892 8.39096 27.9541 2.81323ZM11.0181 18.0884C9.38812 18.0884 8.05138 16.5667 8.05138 14.7136C8.05138 12.8606 9.35957 11.3363 11.0181 11.3363C12.6767 11.3363 14.0134 12.8579 13.9848 14.7136C13.9874 16.5667 12.6767 18.0884 11.0181 18.0884ZM21.9818 18.0884C20.3518 18.0884 19.015 16.5667 19.015 14.7136C19.015 12.8606 20.3232 11.3363 21.9818 11.3363C23.6403 11.3363 24.977 12.8579 24.9485 14.7136C24.9485 16.5667 23.6403 18.0884 21.9818 18.0884Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      <span>Join Discord</span>
                    </Link>
                  </li>
                </ul>
                <button
                  className="flex items-center gap-2 px-3 py-2 font-semibold text-gray-400 rounded-lg"
                  onClick={handleLogout}
                >
                  <LogOut />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="relative pt-4 pb-3 border-t border-[#2e2e2e] w-full">
                <button
                  className="px-4 py-2.5 font-sans flex items-center gap-2 w-full border-none rounded-lg text-base font-semibold transition-colors duration-200 bg-[#212121] hover:bg-[#2e2e2e] text-offwhite cursor-pointer h-[42px]"
                  data-discover="true"
                  onClick={() => setAuthOpen(true)}
                >
                  Sign in or Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {authOpen && <UserAuthentication handleCloseBtn={handleCloseBtn} />}
      {isCreate &&
        (access_token ? (
          <ElementSelection />
        ) : (
          <UserAuthentication handleCloseBtn={handleCloseBtn} />
        ))}
      <Outlet />
    </>
  );
}

export default NavbarComponent;
