import { IMAGES } from '../../utils/app_constants'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

export default function HomeContainer() {
  const handleGoToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({behavior: "smooth"});
  }
  return (
    <section className="bg-gray-50" id='home'>
      <div
        className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl text-bl">
            Univtraze{' '}
            <strong className="font-extrabold text-main sm:block">
              Increase disease prevention.
            </strong>
          </h1>
    
          <p className="mt-4 sm:text-xl sm:leading-relaxed">
          Univtraze is a disease tracing app that enhances disease prevention by quickly identifying and tracing potential outbreaks.
          </p>
    
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={'/social/signup'}>
              <button
                className="block w-full rounded bg-main px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-main focus:outline-none focus:ring active:bg-main sm:w-auto"
              >
                Get Started
              </button>
            </Link>
    
            <Link
              className="max-w-max block w-full rounded px-12 py-3 text-sm font-medium text-main shadow hover:text-main focus:outline-none focus:ring active:text-main sm:w-auto"
              href="/features"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
