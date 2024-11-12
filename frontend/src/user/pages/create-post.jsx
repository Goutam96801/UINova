import React, { createContext, useContext, useState } from 'react'
import CodeEditor from '../components/code-editor';
import { UserContext } from '../../App';
import UserAuthentication from '../components/user-authentication';
import PostCategory from '../components/category';

function CreatePostPage() {
    let { userAuth: {access_token} } = useContext(UserContext);

    const [isEditorVisible, setIsEditorVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleContinue = (category) => {
        setSelectedCategory(category);
        setIsEditorVisible(true);
    };

  return (
    access_token ?
    <div>
      {isEditorVisible ? (
        <CodeEditor selectedCategory={selectedCategory} />
      ) : (
        <PostCategory onContinue={handleContinue}/>
      )}
    </div> : <UserAuthentication/>
  )
}

export default CreatePostPage;
