import { Outlet } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import './app.css';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100'>
      <header className='sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700'>
        <div className='container mx-auto px-2 sm:px-4 py-3 flex justify-between items-center'>
          <a href='/' className='flex items-center gap-1 sm:gap-2 transition-transform hover:scale-105'>
            <div className='bg-red-600 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0'>
              <div className='w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full border-2 border-gray-800'></div>
            </div>
            <h1 className='text-base sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent whitespace-nowrap'>
              ポケモン図鑑
            </h1>
          </a>

          <nav>
            <ul className='flex gap-1 sm:gap-4'>
              <li>
                <a
                  href='/'
                  className='px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap'
                >
                  ホーム
                </a>
              </li>
              <li>
                <a
                  href='/types'
                  className='px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap'
                >
                  タイプ別
                </a>
              </li>
              <li>
                <button
                  onClick={toggleTheme}
                  className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                  aria-label='Toggle dark mode'
                >
                  {theme === 'dark' ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z'
                      />
                    </svg>
                  )}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <Outlet />
      </main>

      <footer className='bg-gray-800 text-white mt-16'>
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <h3 className='text-xl font-bold mb-4'>ポケモン図鑑</h3>
              <p className='text-gray-400'>PokeAPIを利用した最新のポケモン情報サイト</p>
            </div>
            <div>
              <h4 className='text-lg font-medium mb-3'>リンク</h4>
              <ul className='space-y-2'>
                <li>
                  <a href='/' className='text-gray-400 hover:text-white transition-colors'>
                    ホーム
                  </a>
                </li>
                <li>
                  <a href='/types' className='text-gray-400 hover:text-white transition-colors'>
                    タイプ別
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='text-lg font-medium mb-3'>その他</h4>
              <p className='text-gray-400'>
                データは
                <a
                  href='https://pokeapi.co/'
                  className='text-blue-400 hover:text-blue-300 transition-colors'
                >
                  PokeAPI
                </a>
                から提供されています。
              </p>
            </div>
          </div>
          <div className='border-t border-gray-700 mt-8 pt-6 text-center text-gray-500'>
            <p>
              &copy; 2025 ポケモン図鑑 -
              ポケモン名、画像、コンテンツはそれぞれの所有者の所有物です。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
