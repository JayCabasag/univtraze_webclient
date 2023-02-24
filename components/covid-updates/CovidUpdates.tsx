import React from 'react'

export default function CovidUpdates() {
  return (
    <div className="w-full md:max-w-2xl p-4 bg-white rounded-lg flex flex-col gap-2 md:gap-4">
      <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-main dark:text-white">Covid updates</h5>
      </div>
        <article className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow">
            <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
                </svg>

                <span className="text-xs font-medium"> 67.81% </span>
            </div>

            <div>
                <strong className="block text-sm font-medium text-gray-500"> Active cases </strong>

                <p>
                <span className="text-2xl font-medium text-gray-900"> 1000 </span>

                <span className="text-xs text-gray-500"> from 101 </span>
                </p>
            </div>
        </article>

        <article className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow">
            <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
                </svg>

                <span className="text-xs font-medium"> 67.81% </span>
            </div>

            <div>
                <strong className="block text-sm font-medium text-gray-500"> Total Deaths </strong>

                <p>
                <span className="text-2xl font-medium text-gray-900"> 200 </span>

                <span className="text-xs text-gray-500"> 200 </span>
                </p>
            </div>
        </article>
    </div>
  )
}
