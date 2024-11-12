import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../App";
import axios from "axios";
import { Navigate } from "react-router-dom";
import {CircleCheck,BookCheck, Ban} from 'lucide-react';

// Mock data based on the schema
export const adminDataStructure = {
  personal_info: {
    username: "",
    email: "",
    fullname: "",
    profile_img: "",
    isVerified: false,
  },
  account_info: {
    total_post_published: 0,
    total_blog_published: 0,
    total_post_rejected: 0,
    total_blog_rejected: 0,
  },
  post_published: [],
  blog_published: [],
  post_rejected: [],
  blog_rejected: [],
  joinedAt: "",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("published");
  const [adminData, setAdminData] = useState(adminDataStructure);

  let { personal_info: {username, email, fullname, profile_img, isVerified},
        account_info: {total_post_published, total_blog_published, total_post_rejected, total_blog_rejected},
        post_published,
        blog_published,
        post_rejected,
        blog_rejected,
        joinedAt } = adminData;
  
  let {
    adminAuth: { access_token },
    setAdminAuth,
  } = useContext(AdminContext);

  const fetchAdminProfile = async() => {
    await axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + "/admin/get-profile", {}, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data }) => {
        setAdminData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  return (
    !access_token ? <Navigate to="/admin-auth"/> :
    <div className="bg-dark-700 mx-auto p-6 h-[100vh] w-[calc(100vw-250px)] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information Card */}
        <div className=" rounded-lg shadow-xl bg-[#212121] p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="flex items-center space-x-4">
            <img
              src={profile_img}
              alt={fullname}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold flex gap-2 items-center">
                <p>{fullname}</p>{isVerified ? <CircleCheck className="text-green-600 w-5 h-5 text-center"/> : ''}
              </h3>
              <p className="text-sm text-gray-600">
                @{username}
              </p>
              <p className="text-sm">{email}</p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Joined on: {new Date(joinedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Account Statistics Card */}
        <div className=" rounded-lg shadow-xl bg-[#212121] p-6">
          <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Posts Published</p>
              <p className="text-2xl font-bold text-green-500">
                {total_post_published}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Blogs Published</p>
              <p className="text-2xl font-bold text-green-500">
                {total_blog_published}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Posts Rejected</p>
              <p className="text-2xl font-bold text-red-500">
                {total_post_rejected}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Blogs Rejected</p>
              <p className="text-2xl font-bold text-red-500">
                {total_blog_rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-2">
        <div className="border-b border-gray-200">
          <nav className="flex gap-1">
            <button
              className={`py-2 px-4 text-center text-green-500 font-medium text-base flex gap-2 duration-300 rounded ${
                activeTab === "published"
                  ? "bg-[#212121]"
                  : "  hover:bg-[#212121]"
              }`}
              onClick={() => setActiveTab("published")}
            > <BookCheck />
              Published Content
            </button>
            <button
              className={` py-2 px-4 text-center text-red-500 font-medium text-base rounded flex gap-2 duration-300 ${
                activeTab === "rejected"
                  ? "bg-[#212121]"
                  : "  hover:bg-[#212121]"
              }`}
              onClick={() => setActiveTab("rejected")}
            ><Ban />
              Rejected Content
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "published" && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Published Posts */}
              <div className=" rounded-lg shadow-xl bg-[#a5a5a511] p-6">
                <h3 className="text-lg font-semibold mb-2">Published Posts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recently published posts
                </p>
                <ul className="space-y-2">
                  {adminData.post_published.map((post, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{post}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                  View All Published Posts
                </button>
              </div>

              {/* Published Blogs */}
              <div className=" rounded-lg shadow-xl bg-[#a5a5a511] p-6 ">
                <h3 className="text-lg font-semibold mb-2">Published Blogs</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recently published blogs
                </p>
                <ul className="space-y-2">
                  {adminData.blog_published.map((blog, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{blog}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                  View All Published Blogs
                </button>
              </div>
            </div>
          )}

          {activeTab === "rejected" && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Rejected Posts */}
              <div className=" rounded-lg shadow-xl bg-[#a5a5a511] p-6">
                <h3 className="text-lg font-semibold mb-2">Rejected Posts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recently rejected posts
                </p>
                <ul className="space-y-2">
                  {adminData.post_rejected.map((post, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{post}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                  View All Rejected Posts
                </button>
              </div>

              {/* Rejected Blogs */}
              <div className=" rounded-lg shadow-xl p-6 bg-[#a5a5a511">
                <h3 className="text-lg font-semibold mb-2">Rejected Blogs</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recently rejected blogs
                </p>
                <ul className="space-y-2">
                  {adminData.blog_rejected.map((blog, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{blog}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                  View All Rejected Blogs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
