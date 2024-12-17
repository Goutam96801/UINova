import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../App";
import { Users, User, MessageSquare, BookOpen, Search } from "lucide-react";

function AllUserShown() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    adminAuth: { access_token },
  } = useContext(AdminContext);

  const fetchAllUser = async () => {
    await axios
      .post(
        process.env.REACT_APP_SERVER_DOMAIN + "/get-all-user",
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
        setUsers(data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchAllUser();
  }, [access_token]);

  const filteredUsers = users.filter(
    (user) =>
      user.personal_info.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.personal_info.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className=" w-[calc(100vw-250px)] min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold text-gray-100 transition-all duration-300 ease-in-out">
              User Profiles
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full md:w-64 lg:focus:w-96 rounded-full bg-gray-700 border border-gray-600 focus:outline-none md:focus:ring-2 md:focus:ring-blue-500 lg:focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-300 ease-in-out"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-10 transition-all duration-300 ease-in-out">
              <Users className="mx-auto text-gray-500" size={48} />
              <p className="mt-4 text-xl text-gray-400">No users found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
              {filteredUsers.map((user, index) => (
                <div key={index} className="opacity-1 animate-fade-in-up">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-700 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
                          <img
                            src={user.personal_info.profile_img}
                            alt={`${user.personal_info.username}'s profile`}
                            className="rounded-full w-full h-full"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-100">
                            {user.personal_info.fullname}
                          </h3>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <User size={16} />
                            <span className="text-sm">@{user.personal_info.username}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div className="flex items-center space-x-1">
                          <MessageSquare size={16} className="text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">
                            {user.account_info.total_posts} posts
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen size={16} className="text-green-400" />
                          <span className="text-sm font-medium text-gray-300">
                            {user.account_info.total_blogs} blogs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}

export default AllUserShown;
