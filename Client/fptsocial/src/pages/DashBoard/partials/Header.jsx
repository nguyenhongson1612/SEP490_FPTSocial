import { useState } from 'react'
import SearchModal from '~/components/ModalSearch'
import UserMenu from './DropdownProfile'
import { IconSearch } from '@tabler/icons-react';

function Header({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default'
}) {

  const [searchModalOpen, setSearchModalOpen] = useState(false)

  return (
    <header className={`sticky top-0 before:-z-10 z-30 bg-fbWhite`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-16 ${variant === 'v2' || variant === 'v3' ? '' : 'lg:border-b border-gray-200 dark:border-gray-700/60'}`}>

          {/* Header: Left side */}
          <div className="flex">
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <div>
              <button
                className={`w-8 h-8 flex items-center justify-center hover:bg-gray-100 lg:hover:bg-gray-200 dark:hover:bg-gray-700/50 dark:lg:hover:bg-gray-800 rounded-full ml-3 ${searchModalOpen && 'bg-gray-200 dark:bg-gray-800'}`}
                onClick={(e) => { e.stopPropagation(); setSearchModalOpen(true); }}
                aria-controls="search-modal"
              >
                <span className="sr-only">Search</span>
                <IconSearch />
              </button>
              <SearchModal id="search-modal" searchId="search" modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />
            </div>
            {/*  Divider */}
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />
            <UserMenu align="right" />
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;