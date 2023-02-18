import { IMAGES } from '@/utils/app_constants'
import Image from 'next/image'
import React from 'react'

export default function BackToTopButton() {

  const handleScrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  return (
    <button className="fixed bottom-0 right-0 mb-4 mr-4 md:mb-10 md:r-10 bg-main text-white py-2 px-4 rounded hover:bg-main focus:outline-none" onClick={handleScrollToTop}>
        <Image
            src={IMAGES.BACK_TO_TOP_ICON_SVG}
            height={18}
            width={18}
            alt={'back to top'}
        />
    </button>
  )
}
