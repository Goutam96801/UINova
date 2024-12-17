import axios from "axios";
import { Bookmark, BookMarked, CodeXml } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { UserContext } from "../../App";
import ClipLoader from "react-spinners/ClipLoader"

const PostCard = ({ post, user }) => {
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const shadowRootRef = useRef(null); 
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  let {userAuth:{access_token}} = useContext(UserContext);

  useEffect(() => {
    if (user && Array.isArray(user.saved_post)) {
      setIsSaved(user.saved_post.includes(post._id));
    }
  }, [post._id, user]);


  const toggleSave = async () => {
    setLoading(true);
    if (!user) {
      alert('Please log in to save the post');
      return;
    }
    await axios
      .post(process.env.REACT_APP_SERVER_DOMAIN + '/toggle-save-post', { postId: post._id }, {
        headers:{
          Authorization: `Bearer ${access_token}`
        }
      })
      .then((response) => {
        setIsSaved(response.data.isSaved);
        post.saved = response.data.isSaved ? post.saved + 1 : post.saved - 1; 
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error toggling save status:', error);
        setLoading(false);
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

  const handleLinkClick = () => {
    setProgress(70);
    setTimeout(() => {
        setProgress(100);
        navigate(`/${post.user.personal_info.username}/${post.postId}`)
    },500)
  };

  return (
    <article
    className="relative isolate flex flex-col text-black h-full overflow-hidden rounded-md"
  >
    <div className="relative min-h-[250px] cursor-pointer max-h-[520px] rounded-md overflow-hidden flex-grow">
    <article className="card duration-300 transition-all relative isolate flex flex-col text-black h-full overflow-hidden rounded-md">
    <LoadingBar
        color="#7781b7"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className={`relative min-h-[250px] max-h-[520px] rounded-md bg-[${post.theme === "dark" ? '#212121' : '#e8e8e8'}] overflow-hidden flex-grow`}>
        <div className=" h-full w-full flex justify-center items-center overflow-hidden">
          <div className={`relative  bg-${post.theme === 'dark' ? '#212121' : '#e8e8e8'} flex items-center justify-center cursor-pointer h-full`}></div>
          <div className="z-10" ref={previewRef} />
          <button onClick={handleLinkClick} 
            className={`card-btn absolute bottom-2 z-50 right-2 gap-1 text-[#e8e8e8] font-semibold px-2 py-1 rounded text-sm bg-[${post.theme==='light' ? '#212121' : '#a5a5a511'}]`}
          >
            <CodeXml /> Get Code
          </button>
        </div>
      </div>
    </article>
    </div>

    <div className="flex items-center justify-between px-[7px] py-0 mt-[2px] text-[#e8e8e8] h-[28px]">
      <div>
        <Link
          to={`/profile/${post.user.personal_info.username}`}
          className=" hover:text-gray-100 flex items-center justify-start cursor-pointer w-full text-center text-xs font-bold rounded-[6px] text-gray-300 "
        >
          {post.user.personal_info.username}
        </Link>
      </div>
      <div className="flex items-center gap-1 whitespace-nowrap ml-auto text-[#848484] text-[14px] ">
        <span>{post.activity.total_views} views</span>
        <button className="flex hover:bg-dark-500 bg-transparent py-0.5 px-1 text-sm gap-0.5 text-gray-300 cursor-pointer transition-colors  font-sans font-semibold border-none items-center overflow-hidden rounded-md hover:bg-[#303030]" onClick={toggleSave}>
        {loading ? (
              <ClipLoader size={15}/>
            ) : (
              isSaved ? <BookMarked className="w-4 h-4 text-yellow-500" /> : <Bookmark className="w-4 h-4" />
            )}
            {post.activity.total_saves}
        </button>
      </div>
    </div>
  </article>
    
    
  );
};

export default PostCard;
