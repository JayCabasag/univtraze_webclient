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
import CovidUpdates from '@/components/covid-updates/CovidUpdates';
import QrCode from 'qrcode.react'
import base64 from "base-64"

export default function HomeContainer({ children }: { children: ReactNode}) {
  const { uid, type, fullname  } = userStore()
  const [isShowSidebar, setIsShowSidebar] = useState(false)
  const [showUserQrCode, setShowUserQrCode] = useState(false)
  const stringifiedQrData = base64.encode(JSON.stringify({id: uid, type: type, name: fullname}))
  const router = useRouter()
  const isOnDashboardRoute = 
    router.asPath === '/home' || router.asPath === '/home/dashboard' ||
    router.asPath === '/home/emergency-report' || router.asPath === '/home/report-disease'

  const handleToggleUserQrCode = () => {
    setShowUserQrCode(prevState => !prevState)
  }

  const handleToggleSidebar = () => {
    setIsShowSidebar(prevState => !prevState)
  }

  const downloadQrCode = () => {
    const canvas = document.getElementById("qr-gen") as HTMLCanvasElement
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${fullname}_${uid}_${type}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
      <section>
        <nav className="fixed top-0 z-40 w-full bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-md text-main">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button onClick={handleToggleSidebar} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                  <span className="sr-only">Open sidebar</span>
                  <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                  </svg>
              </button>
              <Link href="/" className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Univtraze</span>
              </Link>
            </div>
            <div className="flex items-center">
                <div className="flex items-center ml-3">
                  <div className='flex gap-4 items-center max-w-[180px] md:max-w-md'>
                    <p className='truncate'>Welcome {fullname}</p>
                    <button onClick={handleToggleUserQrCode}>
                      <img className="w-8 h-8 min-w-min rounded-full" src={IMAGES.DEFAULT_PROFILE_PHOTO} alt="user photo" />
                    </button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </nav>

      <aside id="logo-sidebar" className={isShowSidebar ? "w-3/4 md:w-64 z-30 fixed shadow-md h-full md:-mt-[3px] md:z-30" : "fixed top-0 left-0 z-30 md:w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 shadow-md"} aria-label="Sidebar">
        <div className="h-full pt-4 md:pt-0 px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2">
              <li>
                  <Link href="/home/dashboard" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap font-medium text-main">Dashboard</span>
                  </Link>
              </li>
              <li>
                  <Link href="/home/notifications" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
                    <span className="flex-1 ml-3 whitespace-nowrap font-medium text-main">Notifications</span>
                  </Link>
              </li>
              <li>
                  <Link href="/home/temperature-history" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg fill="none" className='flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white' stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap font-medium text-main">Temperature History</span>
                  </Link>
              </li>
              <li>
                  <Link href="/home/update-profile" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg fill="none" className="flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap font-medium text-main">Update profile</span>
                  </Link>
              </li>
              <li>
                  <Link href="/home/room-visited" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg fill="none" stroke="currentColor" className='flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white' strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap font-medium text-main">Room visited</span>
                  </Link>
              </li>
              <li>
                  <Link href="/home/vaccine-information" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg fill="none" className='flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white' stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap font-medium text-main">Vaccine Information</span>
                  </Link>
              </li>
              <li>
                  <Link href="/logout" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg fill="none" className='flex-shrink-0 w-6 h-6 text-main transition duration-75 dark:text-main group-hover:text-gray-900 dark:group-hover:text-white' stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap font-medium text-main">Sign out</span>
                  </Link>
              </li>
            </ul>
        </div>
      </aside>

      <div className="p-4 md:ml-64 mt-16">
        <BreadCrumb />
        <div className='py-4 flex flex-col gap-2 md:gap-0 lg: lg:flex-row '>
            { children }
            {isOnDashboardRoute && (
              <div className='w-full'>
                <CovidUpdates />
              </div>
            )}
        </div>
      </div> 

      {showUserQrCode && (
        <>
        <div drawer-backdrop="true" className="bg-main bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40 h-full w-full" role='dialog'></div>
        <div onBlur={() => console.log("Closed")} id="small-modal" tabIndex={1} className="fixed top-0 left-0 right-0 z-40 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full justify-center items-center flex" role='dialog'>
            <div className="relative w-full h-full max-w-md md:h-auto z-50">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            User QR Code
                        </h3>
                        <button onClick={handleToggleUserQrCode} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="small-modal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-2 md:px-6 flex justify-center items-center flex-col w-full object-contain">
                      <h1 className='uppercase pb-2 font-medium text-main text-xl'>{fullname}</h1>
                      <QrCode
                        id='qr-gen'
                        className='view-room__qr-code'
                        value={stringifiedQrData}
                        size={220}
                      />
                    </div>
                    <div className="flex items-center p-6 space-x-2 rounded-b px-16">
                        <button data-modal-hide="small-modal" type="button" className="text-white bg-main hover:bg-main focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 disabled:bg-gray-700 dark:focus:ring-blue-800 w-full" onClick={downloadQrCode}>Download</button>
                    </div>
                </div>
            </div>
        </div>
      </>
      )}
      
      {isShowSidebar && <div drawer-backdrop="true" onClick={handleToggleSidebar} className="bg-main bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-20 h-full w-full block md:hidden" role='dialog'></div>}
    </section>
  )
}
