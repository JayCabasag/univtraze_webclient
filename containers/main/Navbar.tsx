import { genericPostRequest } from '../../services/genericPostRequest';
import { IMAGES } from '../../utils/app_constants'
import Image from 'next/image'
import Link from 'next/link'
import { Router, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie'
import userStore from '../../states/user/userStates';
import { setUserStates } from '../../states/user/utils';

export default function Navbar() {
  const router = useRouter()
  const { setUid, setEmail, setToken } = userStore((state) => state)
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [scrollDirection, setScrollDirection] = useState('none')

  const [showLoginModal, setShowLoginModal] = useState(false)

  const toggleMobileMenu = () => {
    setShowMobileMenu(prevState => !prevState)
  }
  
  const handleGoToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({behavior: "smooth"});
  }

  return (
    <nav className="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 shadow-sm">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
      <a href="/" className="flex items-center">
          <img src="/favicon.ico" className="h-6 mr-3 sm:h-9" alt="Flowbite Logo" />
          <span className="self-center text-xl font-semibold whitespace-nowrap text-main">Univtraze</span>
      </a>
      <div className="flex md:order-2">
         <Link
          href={'/social/login'}
         >
          <button 
            type="button" 
            className="transition-colors text-white bg-main hover:bg-main focus:ring-1 focus:outline-none focus:ring-main font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:secondary dark:hover:bg-main dark:focus:ring-main"
          >
              Log in
          </button>
         </Link>
          <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded={showMobileMenu} onClick={toggleMobileMenu}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <div 
        className={showMobileMenu
          ? "items-center justify-between w-full md:flex md:w-auto md:order-1" 
          : "items-center justify-between hidden w-full md:flex md:w-auto md:order-1" } 
        id="navbar-sticky"
      >
        <ul className="flex flex-col p-4 mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-md md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <button onClick={() => handleGoToSection('home')} className="block py-2 pl-3 pr-4 text-main bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0" aria-current="page">Home</button>
          </li>
          <li>
            <button onClick={() => handleGoToSection('about')} className="block py-2 pl-3 pr-4 text-main rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</button>
          </li>
          <li>
            <button onClick={() => handleGoToSection('features')} className="block py-2 pl-3 pr-4 text-main rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Features</button>
          </li>
          <li>
            <button  onClick={() => handleGoToSection('reports')} className="block py-2 pl-3 pr-4 text-main rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Reports</button>
          </li>
        </ul>
      </div>
      </div>
    </nav>
  )
}
