import { CURRENT_SERVER_DOMAIN } from '@/services/serverConfig';
import React, { ReactNode, useState } from 'react'
import { GetServerSideProps } from 'next';
import { genericPostRequest } from '@/services/genericPostRequest';
import { decodeJWT } from '@/utils/helpers';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import userStore from '@/states/user/userStates';
import Link from 'next/link';
import { IMAGES } from '@/utils/app_constants';
import BreadCrumb from '@/components/bread-crumb/BreadCrumb';

export default function HomeContainer({response, redirectUrl, isAuthorized, children }: {response: any, redirectUrl: string, isAuthorized: boolean, children: ReactNode}) {
  const router = useRouter()
  const { email  } = userStore()
  const [isShowSidebar, setIsShowSidebar] = useState(false)

  const handleToggleSidebar = () => {
    setIsShowSidebar(prevState => !prevState)
  }

  return (
      <section>
        <nav className="fixed top-0 z-50 w-full bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-md text-main">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button onClick={handleToggleSidebar} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                  <span className="sr-only">Open sidebar</span>
                  <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                  </svg>
              </button>
              <a href="univtraze.net" className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Univtraze</span>
              </a>
            </div>
            <div className="flex items-center">
                <div className="flex items-center ml-3">
                  <div>
                    <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-1 focus:ring-main dark:focus:ring-main" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                      <span className="sr-only">Open user menu</span>
                      <img className="w-8 h-8 rounded-full" src={IMAGES.DEFAULT_PROFILE_PHOTO} alt="user photo" />
                    </button>
                  </div>
                  <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                    <div className="px-4 py-3" role="none">
                      <p className="text-sm text-gray-900 dark:text-white" role="none">
                        Neil Sims
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                        {email}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</a>
                      </li>
                      <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a>
                      </li>
                      <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</a>
                      </li>
                      <li>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </nav>

      <aside id="logo-sidebar" className={isShowSidebar ? "w-3/4 md:w-64 z-50 fixed shadow-md h-full md:-mt-[3px] md:z-40" : "fixed top-0 left-0 z-40 md:w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 shadow-md"} aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2">
              <li>
                  <Link href="/home/dashboard" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">Dashboard</span>
                  </Link>
              </li>
              <li>
                  <Link href="/home/notifications" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">Notifications</span>
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                  </Link>
              </li>
              <li>
                  <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">User information</span>
                  </a>
              </li>
              <li>
                  <Link href="/logout" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">Sign out</span>
                  </Link>
              </li>
            </ul>
        </div>
      </aside>

      <div className="p-4 md:ml-64 mt-16">
        <BreadCrumb />
        <div className='py-4'>
            { children }
        </div>
      </div>
      {isShowSidebar && <div drawer-backdrop="true" onClick={handleToggleSidebar} className="bg-main bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30 h-full w-full block md:hidden" role='dialog'></div>}
    </section>
  )
}
