import React from 'react';
import { useTheme } from '../context/ThemeProvider';
import userAvatar from '../assets/user-avater.svg';

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
          <path fillRule="evenodd" clipRule="evenodd" d="M10.6942 0L20 18.7078L29.3058 4.74611e-08C35.6645 3.34856 40 10.0219 40 17.7078C40 28.7535 31.0457 37.7078 20 37.7078C8.9543 37.7078 0 28.7535 0 17.7078C0 10.0219 4.33546 3.34856 10.6942 0Z" fill="white"/>
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
              <path d="M19.5016 11.3423C19.2971 11.2912 19.0927 11.3423 18.9137 11.4701C18.2492 12.0324 17.4824 12.4924 16.639 12.7991C15.8466 13.1059 14.9776 13.2592 14.0575 13.2592C11.9872 13.2592 10.0958 12.4158 8.74121 11.0611C7.38658 9.70649 6.54313 7.81512 6.54313 5.74483C6.54313 4.87582 6.69649 4.03237 6.95208 3.26559C7.23323 2.4477 7.64217 1.70649 8.17891 1.06751C8.40895 0.786362 8.35783 0.377416 8.07668 0.147384C7.89776 0.0195887 7.69329 -0.0315295 7.48882 0.0195887C5.31629 0.607448 3.42492 1.91096 2.07029 3.64898C0.766773 5.36144 0 7.48285 0 9.78317C0 12.5691 1.1246 15.0995 2.96486 16.9397C4.80511 18.78 7.3099 19.9046 10.1214 19.9046C12.4728 19.9046 14.6454 19.0867 16.3834 17.732C18.147 16.3519 19.4249 14.3838 19.9617 12.1346C20.0639 11.7768 19.8594 11.419 19.5016 11.3423Z" fill="#7E88C3"/>
            </svg>

          ) : (
            // Cirle icon
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.91783 0C2.20609 0 0 2.20652 0 4.91826C0 7.63 2.20609 9.83652 4.91783 9.83652C7.62913 9.83652 9.83565 7.63043 9.83565 4.91826C9.83565 2.20609 7.62913 0 4.91783 0Z" fill="#858BB2"/>
            </svg>

          )}
        </button>

        {/* Divider */}
        <div className="hidden md:block w-full h-px bg-[#494E6E]" />
        <div className="md:hidden h-[72px] w-px bg-[#494E6E]" />

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-semibold text-white">
          <img
            src={userAvatar}
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;