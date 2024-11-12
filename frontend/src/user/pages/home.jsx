import React from 'react';
import {Search, Rocket } from "lucide-react"

function HomePage() {
  return (
    <div className='-z-0'>
      <main className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-8 flex items-center justify-center space-x-2 text-green-400">
          <Rocket className="h-5 w-5" />
          <span className="text-sm font-medium">19 NEW ELEMENTS THIS WEEK!</span>
          <div className="flex -space-x-1 overflow-hidden">
            <div className="inline-block h-6 w-6 rounded-full bg-purple-500"></div>
            <div className="inline-block h-6 w-6 rounded-full bg-blue-500"></div>
            <div className="inline-block h-6 w-6 rounded-full bg-orange-500"></div>
          </div>
        </div>

        <h2 className="mb-4 text-5xl font-bold leading-tight md:text-6xl">
          The Modern Library<br />of Open-Source UI
        </h2>
        <p className="mb-8 text-xl text-gray-400">
          Community-built library of UI elements.<br />
          Copy as HTML/CSS, Tailwind, React and Figma.
        </p>

        <div className="flex w-full max-w-md items-center space-x-2">
          <input 
            type="text" 
            placeholder="Search for components, styles, creators..." 
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 w-full px-6 py-4 pr-2 mr-px font-sans font-normal rounded-xl text-base border-none outline-none text-dark-900 placeholder:text-gray-500"
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 p-4 rounded-xl font-semibold duration-300">
            Search
          </button>
        </div>
      </main>
    </div>
  )
}

export default HomePage
