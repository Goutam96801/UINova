import React from "react";

function Footer() {
  return (
    <footer
      aria-label="Site Footer"
      className="pb-[150px] bg-gradient-to-t from-dark-800 to-dark-700"
    >
      <div className="px-4 py-16 mx-auto space-y-8 max-w-screen-2xl sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-teal-600">
              <img src="/assets/logo-png-BXFOQKfc.png" className="w-24" alt="" />
            </div>
            <p className="max-w-xs mt-4 text-base leading-5 text-gray-400">
              Uiverse | The universe of UI
            </p>
            <div>
              <p className="flex items-center max-w-xs gap-2 mt-4 font-semibold leading-5 text-offwhite">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M12 2v1.75M16 21h-4m-4 0h4m9-16a4.821 4.821 0 0 1-4.055.12l-1.583-.68A8.532 8.532 0 0 0 12 3.75M3 5a4.821 4.821 0 0 0 4.055.12l1.583-.68A8.532 8.532 0 0 1 12 3.75M12 21V3.75m7 1.75-2.892 6.145a3.196 3.196 0 1 0 5.784 0L19 5.5Zm-14 0-2.892 6.145a3.196 3.196 0 1 0 5.784 0L5 5.5Z"></path>
                </svg>{" "}
                MIT License
              </p>
              <p className="max-w-xs mt-1 text-sm leading-5 text-gray-400">
                All content (UI elements) on this site are published under the{" "}
                <a
                  href="https://opensource.org/license/mit"
                  target="_blank"
                  className="underline underline-offset-2"
                  rel="noreferrer"
                >
                  MIT License
                </a>
                .
              </p>
            </div>
            <ul className="flex gap-6 mt-8 list-none">
              <li>
                <a
                  href="https://www.instagram.com/uiverse.io/"
                  rel="noopener"
                  target="_blank"
                  className="transition text-gray-400 hover:hover:text-indigo-500"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/uiverse_io"
                  rel="noopener"
                  target="_blank"
                  className="transition text-gray-400 hover:hover:text-indigo-500"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/KD8ba2uUpT"
                  rel="noopener"
                  target="_blank"
                  className="transition text-gray-400 hover:text-indigo-500"
                >
                  <span className="sr-only">Discord</span>
                  <svg
                    width="33"
                    height="27"
                    className="w-6 h-6"
                    viewBox="0 0 33 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.9541 2.81323C25.818 1.81378 23.5339 1.08742 21.146 0.673828C20.8527 1.20404 20.5101 1.91719 20.2739 2.4845C17.7354 2.10275 15.2203 2.10275 12.7286 2.4845C12.4924 1.91719 12.142 1.20404 11.8461 0.673828C9.45561 1.08742 7.16891 1.81645 5.03277 2.81853C0.724134 9.32943 -0.443865 15.6786 0.140135 21.9377C2.99785 24.0717 5.76731 25.3681 8.49004 26.2164C9.1623 25.2912 9.76186 24.3077 10.2784 23.2711C9.29466 22.8973 8.35248 22.4361 7.46223 21.9006C7.69841 21.7256 7.92943 21.5426 8.15262 21.3544C13.5825 23.8941 19.4822 23.8941 24.8473 21.3544C25.0731 21.5426 25.3041 21.7256 25.5377 21.9006C24.6448 22.4387 23.7 22.9 22.7163 23.2738C23.2328 24.3077 23.8298 25.2939 24.5046 26.219C27.23 25.3707 30.002 24.0744 32.8597 21.9377C33.545 14.6818 31.6892 8.39096 27.9541 2.81323ZM11.0181 18.0884C9.38812 18.0884 8.05138 16.5667 8.05138 14.7136C8.05138 12.8606 9.35957 11.3363 11.0181 11.3363C12.6767 11.3363 14.0134 12.8579 13.9848 14.7136C13.9874 16.5667 12.6767 18.0884 11.0181 18.0884ZM21.9818 18.0884C20.3518 18.0884 19.015 16.5667 19.015 14.7136C19.015 12.8606 20.3232 11.3363 21.9818 11.3363C23.6403 11.3363 24.977 12.8579 24.9485 14.7136C24.9485 16.5667 23.6403 18.0884 21.9818 18.0884Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <div></div>
            <div>
              <p className="font-semibold text-offwhite font-display">Resources</p>
              <nav aria-label="Footer Navigation - Legal" className="mt-6">
                <ul className="space-y-4 text-sm list-none">
                  <li>
                    <a
                      href="https://cssbuttons.io"
                      target="_blank"
                      className="transition text-gray-400 hover:opacity-75"
                    >
                      Cssbuttons.io
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://neumorphism.io"
                      target="_blank"
                      className="transition text-gray-400 hover:opacity-75"
                    >
                      Neumorphism.io
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div>
              <p className="font-semibold text-offwhite font-display">
                Information
              </p>
              <nav aria-label="Footer Navigation - Legal" className="mt-6">
                <ul className="space-y-4 text-sm list-none">
                  <li>
                    <a
                      className="transition text-gray-400 hover:opacity-75"
                      data-discover="true"
                      href="/blog"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      className="transition text-gray-400 hover:opacity-75"
                      data-discover="true"
                      href="/guidelines"
                    >
                      Post Guidelines
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div>
              <p className="font-semibold text-offwhite font-display">Legal</p>
              <nav aria-label="Footer Navigation - Company" className="mt-6">
                <ul className="space-y-4 text-sm list-none">
                  <li>
                    <a
                      href="https://app.termly.io/document/terms-of-service/bdc0e7cf-cb88-4f24-9cb5-13761e20dedb"
                      className="transition text-gray-400 hover:opacity-75"
                    >
                      Terms and Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://app.termly.io/document/privacy-policy/fe317b39-7972-4f85-b7c6-d4f562e429d4"
                      className="transition text-gray-400 hover:opacity-75"
                    >
                      Privacy policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://app.termly.io/document/cookie-policy/4e4bbc89-b80d-43d6-98bc-02ee075cc311"
                      className="transition text-gray-400 hover:opacity-75"
                    >
                      Cookie policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://app.termly.io/document/disclaimer/eabc96f8-640d-4858-aadc-c30f646265ed"
                      className="transition text-gray-400 hover:opacity-75"
                    >
                      Disclaimer
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          © 2024 Pixel Galaxies. All rights reserved. - Uiverse.io
        </p>
      </div>
    </footer>
  );
}

export default Footer;
