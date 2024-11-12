import React, { useState } from 'react'

function PostSubmitAlert({handleCloseBtn, handleSubmitBtn}) {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div 
    //   ref={modalRef}
      tabIndex={-1}
      className="bg-[#212121] p-6 rounded-lg shadow-lg max-w-sm w-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <h2 id="modal-title" className="text-xl font-bold mb-4">Confirm Submission</h2>
      <p className="mb-6">Once submitted, you won't be able to edit this post. Proceed?</p>
      <div className="flex justify-end space-x-4">
        <button onClick={handleCloseBtn}
        //   onClick={closeModal}
          className="px-4 py-2 duration-300 rounded font-semibold hover:bg-[#a5a5a511]"
        >
          Cancel
        </button>
        <button onClick={handleSubmitBtn}
        //   onClick={submitPostForReview}
          className="px-4 py-2 bg-purple-500 text-white font-semibold rounded duration-300 hover:bg-purple-600"
        >
          Submit for Review
        </button>
      </div>
    </div>
  </div>
  )
}

export default PostSubmitAlert
