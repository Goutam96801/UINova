import React, { useState } from "react";
import { Link } from "react-router-dom";
import {StickyNote, X, SquarePen, Hourglass} from 'lucide-react';

function ProfileDetails() {
    const [activeTab, setActiveTab] = useState('posts');

    const iconMap = {
        StickyNote, X, SquarePen, Hourglass 
    }

    const tabs = [
        {key:"posts", label:"Posts", icon:"", color:""},
        {key:"blogs", label:"Blogs", icon:"StickyNote", color:""},
        {key:"review", label:"review", icon:"Hourglass", color:"yellow-500"},
        {key:"rejected", label:"Rejected", icon:"X", color:"red-500"},
        {key:"drafts", label:"Drafts", icon:"SquarePen", color:"cyan-500"},

    ]
  return (
    <div>
      <div className="flex-wrap justify-between hidden gap-1 sm:flex">
        <div>
          <nav className="flex flex-wrap gap-2" aria-label="Tabs">
            {
                tabs.map(({key, label, icon, color})=>{
                    const IconComponent = iconMap[icon];
                    return (
                        <Link
                        key={key}
              data-discover="true"
              className="bg-dark-600 text-gray-100 rounded-md px-6 py-2 text-base font-semibold flex items-center gap-2 pl-5 hover:bg-[#212121]"
              to=""
              aria-current="page"
            >
              {IconComponent && <IconComponent className={`w-5 h-5 text-${color}`}/>}{" "}
              {label}
            </Link>
                    )
                })
            }
            {/* <Link
              data-discover="true"
              className="bg-dark-600 text-gray-100 rounded-md px-6 py-2 text-base font-semibold flex items-center gap-2 pl-5 hover:bg-[#212121]"
              to=""
              aria-current="page"
            >
              {" "}
              Posts
            </Link>
            <Link
              data-discover="true"
              className="text-gray-300 rounded-md px-6 py-2 text-base font-semibold flex items-center gap-2 pl-5 hover:bg-[#212121]"
              to="/profile/Goutam96801/variations"
            >
              <StickyNote className="w-5 h-5" />{" "}
              Blogs
            </Link>
            <Link
              data-discover="true"
              className="text-gray-300 hover:bg-[#212121] rounded-md px-6 py-2 text-base font-semibold flex items-center gap-2 pl-5"
              to="/profile/Goutam96801/review"
            >
            <Hourglass className="text-yellow-500 w-5 h-4"/>
              Review
            </Link>
            <Link
              data-discover="true"
              className="text-gray-300 hover:bg-[#212121] rounded-md px-6 py-2 text-base font-semibold flex items-center gap-2 pl-5"
              to="/profile/Goutam96801/needs_work"
            >
              <X  className="text-red-500 w-5 h-5"/>{" "}
              Rejected
            </Link>
            <Link
              data-discover="true"
              className="text-gray-300 hover:bg-[#212121] rounded-md px-6 py-2 text-base font-semibold flex items-center gap-2 pl-5"
              to="/profile/Goutam96801/draft"
            >
              <SquarePen className="text-cyan-500 w-5 h-5"/>{" "}
              Drafts
            </Link> */}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-1 gap-y-2 ">
          <div className="relative">
            <button className="text-gray-100 capitalize font-semibold h-[40px] text-sm dropdown-trigger px-3 py-2 hover:bg-dark-600 rounded-lg flex items-center justify-center">
              <span className="block mr-1 icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="block w-4 h-4 mr-1 translate-y-[-1px]"
                >
                  <path d="M20 4H4v2.586a1 1 0 0 0 .293.707l5.414 5.414a1 1 0 0 1 .293.707V18l4 3v-7.586a1 1 0 0 1 .293-.707l5.414-5.414A1 1 0 0 0 20 6.586V4Z"></path>
                </svg>
              </span>
              favorites
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="w-4 h-4 ml-[3px]"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"
                ></path>
              </svg>
            </button>
            <nav className="rounded-lg absolute border-dark-600/80 border-2 top-[40px] right-0 translate-y-0 z-[1000] p-1 bg-dark-600 transition-all duration-500 ease shadow-xl bg-dark-600 opacity-0 invisible translate-y-[-20px]">
              <ul>
                <li>
                  <Link
                    className="text-gray-300 font-sans hover:text-gray-100 hover:bg-dark-700 no-underline px-5 py-2.5 flex items-center justify-start border-none bg-transparent cursor-pointer w-full text-center text-sm font-semibold m-0 whitespace-nowrap rounded-[6px]"
                    data-discover="true"
                    to="/profile/Goutam96801/approved?orderBy=randomized"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M12 12h.01M16 8h.01M8 8h.01M8 16h.01M16 16h.01M11 21h2c2.8 0 4.2 0 5.27-.545a5 5 0 0 0 2.185-2.185C21 17.2 21 15.8 21 13v-2c0-2.8 0-4.2-.545-5.27a5 5 0 0 0-2.185-2.185C17.2 3 15.8 3 13 3h-2c-2.8 0-4.2 0-5.27.545A5 5 0 0 0 3.545 5.73C3 6.8 3 8.2 3 11v2c0 2.8 0 4.2.545 5.27a5 5 0 0 0 2.185 2.185C6.8 21 8.2 21 11 21Z"></path>
                    </svg>
                    <span className="whitespace-nowrap">Randomized</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-300 font-sans hover:text-gray-100 hover:bg-dark-700 no-underline px-5 py-2.5 flex items-center justify-start border-none bg-transparent cursor-pointer w-full text-center text-sm font-semibold m-0 whitespace-nowrap rounded-[6px]"
                    data-discover="true"
                    to="/profile/Goutam96801/approved?orderBy=favorites"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="mr-2 w-5 h-5"
                    >
                      <path d="M5 9c0-1.861 0-2.792.245-3.545a5 5 0 0 1 3.21-3.21C9.208 2 10.139 2 12 2s2.792 0 3.545.245a5 5 0 0 1 3.21 3.21C19 6.208 19 7.139 19 9v13l-1.794-1.537c-1.848-1.584-2.771-2.376-3.808-2.678a5 5 0 0 0-2.796 0c-1.037.302-1.96 1.094-3.808 2.678L5 22V9Z"></path>
                    </svg>
                    <span className="whitespace-nowrap">Favorites</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-300 font-sans hover:text-gray-100 hover:bg-dark-700 no-underline px-5 py-2.5 flex items-center justify-start border-none bg-transparent cursor-pointer w-full text-center text-sm font-semibold m-0 whitespace-nowrap rounded-[6px]"
                    data-discover="true"
                    to="/profile/Goutam96801/approved?orderBy=views"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 w-5 h-5"
                      strokeWidth="2"
                    >
                      <path d="M3 14c0-2.188 2.7-7 9-7s9 4.813 9 7m-6 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
                    </svg>
                    <span className="whitespace-nowrap">Views</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-300 font-sans hover:text-gray-100 hover:bg-dark-700 no-underline px-5 py-2.5 flex items-center justify-start border-none bg-transparent cursor-pointer w-full text-center text-sm font-semibold m-0 whitespace-nowrap rounded-[6px]"
                    data-discover="true"
                    to="/profile/Goutam96801/approved?orderBy=recent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M8 2v2.128M8 6V4.128M16 2v2.128M16 6V4.128M20.96 10c.04.788.04 1.755.04 3 0 2.796 0 4.194-.457 5.296a6 6 0 0 1-3.247 3.247C16.194 22 14.796 22 12 22c-2.796 0-4.193 0-5.296-.457a6 6 0 0 1-3.247-3.247C3 17.194 3 15.796 3 13c0-1.245 0-2.212.04-3m17.92 0c-.05-.982-.163-1.684-.417-2.296a6 6 0 0 0-3.247-3.247A5.136 5.136 0 0 0 16 4.127M20.96 10H3.04m0 0c.05-.982.163-1.684.417-2.296a6 6 0 0 1 3.247-3.247A5.135 5.135 0 0 1 8 4.127m0 0C8.941 4 10.172 4 12 4c1.828 0 3.059 0 4 .128"></path>
                    </svg>
                    <span className="whitespace-nowrap">Recent</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="relative">
            <button className="text-gray-100 capitalize font-semibold h-[40px] text-sm dropdown-trigger px-3 py-2 hover:bg-dark-600 rounded-lg flex items-center justify-center">
              Any theme
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="w-4 h-4 ml-[3px]"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"
                ></path>
              </svg>
            </button>
            <nav className="rounded-lg absolute border-dark-600/80 border-2 top-[40px] right-0 translate-y-0 z-[1000] p-1 bg-dark-600 transition-all duration-500 ease shadow-xl bg-dark-600 opacity-0 invisible translate-y-[-20px]">
              <ul>
                <li>
                  <Link
                    className="text-gray-300 font-sans hover:text-gray-100 hover:bg-dark-700 no-underline px-5 py-2.5 flex items-center justify-start border-none bg-transparent cursor-pointer w-full text-center text-sm font-semibold m-0 whitespace-nowrap rounded-[6px]"
                    data-discover="true"
                    to="/profile/Goutam96801/approved?theme=all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="mr-2 w-5 h-5"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        fill="currentColor"
                        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-2V6a6 6 0 1 1 0 12z"
                      ></path>
                    </svg>
                    <span className="whitespace-nowrap">Any theme</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-300 font-sans hover:text-gray-100 hover:bg-dark-700 no-underline px-5 py-2.5 flex items-center justify-start border-none bg-transparent cursor-pointer w-full text-center text-sm font-semibold m-0 whitespace-nowrap rounded-[6px]"
                    data-discover="true"
                    to="/profile/Goutam96801/approved?theme=dark"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="mr-2 w-5 h-5"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        fill="currentColor"
                        d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z"
                      ></path>
                    </svg>
                    <span className="whitespace-nowrap">Dark</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-300 font-sans hover:text-gray-100 hover:bg-dark-700 no-underline px-5 py-2.5 flex items-center justify-start border-none bg-transparent cursor-pointer w-full text-center text-sm font-semibold m-0 whitespace-nowrap rounded-[6px]"
                    data-discover="true"
                    to="/profile/Goutam96801/approved?theme=light"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="mr-2 w-5 h-5"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        fill="currentColor"
                        d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"
                      ></path>
                    </svg>
                    <span className="whitespace-nowrap">Light</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
