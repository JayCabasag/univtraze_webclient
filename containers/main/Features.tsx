import Link from 'next/link';
import React from 'react';

export default function FeaturesContainer() {
  return (
    <section className="text-gray-600 body-font" id='features'>
    <div className="container px-5 py-24 mx-auto">
        <h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-main mb-20">Features</h1>
        <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
        <div className="p-4 md:w-1/3 flex ">
            <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-main mb-4 flex-shrink-0">
            <svg fill="none" className='p-2' stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>


            </div>
            <div className="flex-grow pl-6">
            <h2 className="text-main text-lg title-font font-medium mb-2">Contact Tracing</h2>
            <p className="leading-relaxed text-base">This is the most important feature of a tracing app: Tracks the rooms users visited and notifies them of close contact with a person who tested positive from a disease.</p>
            <Link
              className="mt-5 group relative inline-flex items-center overflow-hidden rounded bg-main px-8 py-3 text-white focus:outline-none focus:ring active:bg-main"
              href="/features"
            >
                <span
                    className="absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4"
                >
                <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                </svg>
                </span>

                <span className="text-sm font-medium transition-all group-hover:mr-4">
                    Learn more
                </span>
            </Link>
            </div>
        </div>
        <div className="p-4 md:w-1/3 flex">
            <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-main mb-4 flex-shrink-0">
                <svg fill="none" className='p-2' stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            </div>
            <div className="flex-grow pl-6 flex flex-col">
            <h2 className="text-main text-lg title-font font-medium mb-2">Test Results</h2>
            <p className="leading-relaxed text-base">The app can allow users to upload their test results to the app, which can then be used by public health officials to track the spread of the disease.</p>
            <Link
              className="align-self-end max-w-max mt-5 group relative inline-flex items-center overflow-hidden rounded bg-main px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
              href="/features"
            >
                <span
                    className="absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4"
                >
                <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                </svg>
                </span>

                <span className="text-sm font-medium transition-all group-hover:mr-4">
                    Learn more
                </span>
            </Link>
            </div>
        </div>
        <div className="p-4 md:w-1/3 flex ">
            <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-main mb-4 flex-shrink-0">
            <svg fill="none" className='p-2' stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            </div>
            <div className="flex-grow pl-6">
            <h2 className="text-main text-lg title-font font-medium mb-2">Alert Notifications</h2>
            <p className="leading-relaxed text-base">The app can send notifications to users when there is an outbreak in their area or when they have been in close contact with someone who has tested positive.</p>
            <Link
              className="mt-5 group relative inline-flex items-center overflow-hidden rounded bg-main px-8 py-3 text-white focus:outline-none focus:ring active:bg-main"
              href="/features"
            >
                <span
                    className="absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4"
                >
                <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                </svg>
                </span>

                <span className="text-sm font-medium transition-all group-hover:mr-4">
                    Learn more
                </span>
            </Link>
            </div>
        </div>
        </div>
    </div>
    </section>
  )
}
