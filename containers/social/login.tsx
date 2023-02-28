import { genericPostRequest } from '@/services/genericPostRequest'
import Link from 'next/link'
import React, { useState } from 'react'
import jwt from 'jsonwebtoken'
import { setAuthorizationCookie, setUserStates } from '@/states/user/utils'
import { useRouter } from 'next/router'

export default function LoginPage() {
  // data
  const router = useRouter()
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  //methods
  const handleShowPassword = () => {
    setShowPassword(prevState => !prevState)
  }
  const setError = (errorMessageText: string) => {
    setIsError(true)
    setErrorMessage(errorMessageText)
  }
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const usernameInput = form.elements.namedItem("email") as HTMLInputElement;
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement;
  
    const email = usernameInput?.value as string;
    const password = passwordInput?.value as string;

    if (email === ''){
      return setError('Please input your email')
    }
    if (password === '') {
      return setError('Please input your password')
    }

    setIsFetching(true)
    await genericPostRequest({
      params: { email, password }, 
      path: '/user/login', 
      success: async (response) => {
        if(response.success === 1){
          const token = response?.token
          const decoded = await jwt.decode(token) as any;
          const email = decoded.result.email
          const uid = decoded?.result?.id
          const type = decoded.result.type
          localStorage?.setItem("token", token)
          localStorage?.setItem("email", email)
          localStorage?.setItem("uid", uid)
          setUserStates(uid as number, email, token, true, type)
          setAuthorizationCookie(token)
          if (type) {
            return router.push("/home")
          }
          return router.push("/verify-account")
        }
        if(response.success === 0){
          setIsError(true)
          setErrorMessage(response.data)
        }
        setIsFetching(false)
      }, 
      error: (errorResponse) => {
        setIsFetching(false)
      }
    })
  }

  //templates
  return (
    <main className='flex flex-col h-screen w-screen'>
        <div className='text-main font-bold text-2xl mt-4 ml-4  md:mt-11 md:ml-12 h-12'><Link href={'/'}>Univtraze</Link></div>
        <div 
          className='flex w-full max-w-max-xl self-center flex-col md:flex-row mt-10  xl:mt-16  md:mt-32 transition-all p-4'
        > 
            <div className='flex-1'>
                <h1 
                  className='text-3xl md:text-5xl text-main font-medium'
                >Nice to see you <br></br> again.</h1>
                <p
                  className='mt-4 hidden md:block '
                >Don't have an account yet? <Link className="underline" href="/social/signup">Sign up</Link> </p>
            </div>

            <div className='flex flex-col flex-1'>
                <div
                  className='max-w-max-sm md:px-8'
                >
                  <div className="mx-auto max-w-lg">
                    <form onSubmit={handleLogin} className="mb-0 space-y-4 rounded-lg p-4 md:p-8 shadow-md md:shadow-lg">
                      <p className="text-2xl mb-10 text-main font-medium">Log in</p>

                      <div>
                        <label htmlFor="email" className="text-sm font-medium">Email</label>

                        <div className="relative mt-1">
                          <input
                            type="email"
                            id="email"
                            className="w-full rounded-lg border-gray-200 py-3 px-4 pr-12 text-sm shadow-sm"
                            placeholder="Enter email"
                          />

                          <span className="absolute inset-y-0 right-4 inline-flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="password" className="text-sm font-medium">Password</label>

                        <div className="relative mt-1">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id={"password"}
                            name='password'
                            className="w-full rounded-lg border-gray-200 py-3 px-4 pr-12 text-sm shadow-sm"
                            placeholder="Enter password"
                          />

                          <button
                            onClick={handleShowPassword}
                            type='button'
                          >
                            <span className="absolute inset-y-0 right-4 inline-flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                {
                                  showPassword
                                  ? <>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </>
                                  : <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                }
                              </svg>
                            </span>
                          </button>
                        </div>
                      </div>
                      {isError && <p className='text-red-500'>{errorMessage}</p>}
                      <button
                        type="submit"
                        className="block w-full rounded-lg hover:bg-main bg-main px-5 py-3 text-sm font-medium text-white"
                        disabled={isFetching}
                      >
                        {isFetching ? 'Please wait...' : 'Sign in'}
                      </button>

                      <p className="text-center text-sm text-gray-500">
                        No account? {' '}
                        <Link className="underline" href="/social/signup">Sign up</Link>
                      </p>
                    </form>
                  </div>
                </div>
                </div>
            </div>
    </main>
  )
}
