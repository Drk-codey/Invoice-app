import React from 'react';
import { useTheme } from '../context/ThemeProvider';

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      className="
        fixed top-0 left-0 z-50
        flex md:flex-col
        w-full h-[72px]
        md:w-[103px] md:h-screen md:rounded-r-[20px]
        bg-[#373B53] dark:bg-[#1E2139]
        overflow-hidden
      "
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="relative flex items-center justify-center w-[72px] h-[72px] md:w-[103px] md:h-[103px] flex-shrink-0 bg-primary rounded-r-[20px] overflow-hidden cursor-pointer">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-primary-hover rounded-tl-[20px]" />
        <svg className="relative z-10" width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6942 0L20 18.7078L29.3058 4.74611e-08C35.6645 3.34856 40 10.0219 40 17.7078C40 28.7535 31.0457 37.7078 20 37.7078C8.9543 37.7078 0 28.7535 0 17.7078C0 10.0219 4.33546 3.34856 10.6942 0Z" fill="white"/>
        </svg>

      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom controls */}
      <div className="flex md:flex-col items-center gap-6 px-4 md:px-0 md:pb-6 md:pt-0">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="p-2 rounded-full hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {theme === 'light' ? (
            // Moon icon
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.502 11.374a.703.703 0 00-.71-.167 7.5 7.5 0 01-9.999-9.999.703.703 0 00-.167-.71.72.72 0 00-.74-.187 10.002 10.002 0 1013.803 13.803.72.72 0 00-.187-.74z"
                fill="#858BB2"
              />
            </svg>
          ) : (
            // Sun icon
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.994 1.67a.667.667 0 01.667.666v1.334a.667.667 0 11-1.334 0V2.336a.667.667 0 01.667-.667zm0 14.666a.667.667 0 01.667.667v1.333a.667.667 0 11-1.334 0V17a.667.667 0 01.667-.666zm-8-6.667H.66a.667.667 0 000 1.334h1.334a.667.667 0 100-1.334zm16.666 0h-1.333a.667.667 0 100 1.334h1.333a.667.667 0 100-1.334zM4.16 4.218a.667.667 0 01.943 0l.942.942a.667.667 0 01-.942.943l-.943-.943a.667.667 0 010-.942zm9.894 9.894a.667.667 0 01.943 0l.942.942a.667.667 0 11-.942.943l-.943-.943a.667.667 0 010-.942zM4.16 15.782l.942-.942a.667.667 0 11.943.942l-.943.943a.667.667 0 11-.942-.943zm9.894-9.894l.942-.942a.667.667 0 11.943.942l-.943.943a.667.667 0 11-.942-.943zm-4.06 7.445a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm0-1.333a2 2 0 100-4 2 2 0 000 4z"
                fill="#7E88C3"
              />
            </svg>
          )}
        </button>

        {/* Divider */}
        <div className="hidden md:block w-full h-px bg-[#494E6E]" />
        <div className="md:hidden h-[72px] w-px bg-[#494E6E]" />

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold text-white">
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=invoice"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;