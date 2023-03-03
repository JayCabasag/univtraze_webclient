import React from 'react'

export default function LoadingSub() {
  return (
    <section className="flex items-center justify-center space-x-2 h-[320px] w-full">
        <div
          className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
        </div>
        <p className='text-sm font-medium'>Loading... Please wait</p>
    </section>
  )
}