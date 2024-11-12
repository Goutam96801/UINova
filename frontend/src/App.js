import './App.css';
import {Routes, Route} from 'react-router-dom';
import NavbarComponent from './user/components/navbar';
import HomePage from './user/pages/home';
import UserAuthentication from './user/components/user-authentication';
import { createContext, useEffect, useState } from 'react';
import { lookInSession } from './common/session';
import ProfilePage from './user/pages/profile';
import CreatePostPage from './user/pages/create-post';
import AdminHome from './admin/pages/home-page';
import AdminSidebar from './admin/components/sidebar';
import AdminDashboard from './admin/pages/dashboard';
import AdminPost from './admin/components/posts';
import AdminPostDetails from './admin/pages/post-details';
import Sidebar from './user/components/sidebar';
import Elements from './user/pages/elements';
import PostDetails from './user/pages/post-details';

export const UserContext = createContext({});
export const AdminContext = createContext({});

function App() {
  const [userAuth, setUserAuth] = useState({});
  const [adminAuth, setAdminAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");
    let adminInSession = lookInSession("admin");
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null})
    adminInSession ? setAdminAuth(JSON.parse(adminInSession)) : setAdminAuth({access_token:null});
  },[])
  return (
    <UserContext.Provider value={{userAuth, setUserAuth}}>
      <AdminContext.Provider value={{adminAuth, setAdminAuth}}>
    <Routes>
      <Route path='/' element={<NavbarComponent/>}>
      <Route path='' element={<HomePage/>}/>
      <Route path='/profile/:id' element={<ProfilePage/>}/>
      <Route path='/create' element={<CreatePostPage/>}/>
      <Route path={'/:category'} element={<Elements />}/>
      <Route path='posts/:username/:postId' element={<PostDetails/>}/>
      </Route>
      <Route path='/admin-auth' element={<AdminHome/>}/>
      <Route path='/admin/' element={<AdminSidebar/>}>
      <Route path='dashboard' element={<AdminDashboard/>}/>
      <Route path='posts' element={<AdminPost/>}/>
      <Route path='posts/:username/:postId' element={<AdminPostDetails/>}/>
      </Route>
    </Routes>
    </AdminContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
