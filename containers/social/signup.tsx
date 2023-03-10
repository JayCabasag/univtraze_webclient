import { genericPostRequest } from '@/services/genericPostRequest'
import { isEmailValid, isPasswordValid } from '@/utils/helpers'
import { SignUpMessages } from '@/utils/messages'
import Link from 'next/link'
import React, { useState } from 'react'

export default function SignUpPage() {
  //data
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  //methods
  const handleShowPassword = () => {
    setShowPassword(prevState => !prevState)
  }

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(prevState => !prevState)
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget
    const emailInput = form.elements.namedItem('email') as HTMLInputElement
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement
    const confirmPasswordInput = form.elements.namedItem('passwordConfirm') as HTMLInputElement

    const email = emailInput?.value as string ?? ''
    const password = passwordInput?.value as string ?? ''
    const confirmPassword = confirmPasswordInput?.value as string ?? ''

    if(!isEmailValid(email)){
      setIsError(true)
      setErrorMessage('Invalid email')
      return
    }
    if(!isPasswordValid(password)){
      setIsError(true)
      setErrorMessage('Password is weak, make sure to add at least 8 characters, at least one lowercase letter, at least one uppercase letter, at least one digit, and at least one special character (@$!%*?&)!')
      return 
    }
    if(password !== confirmPassword){
      setIsError(true)
      setErrorMessage('Password and confirm do not match!')
      return
    }
    setIsError(false)
    setIsSuccess(false)
    setIsFetching(true)

    await genericPostRequest({
      params: { 
          "email": email,
          "password": password,
          "provider": "email",
          "type": null
      },
      path: '/user/signup',
      success: (response) => {
        if(response.success === 1){
          setSuccessMessage('Account has been created successfully.')
          setIsSuccess(true)
        }
        if(response.success === 0){
          setIsError(true)
          setErrorMessage(response.message)
        }
        setIsFetching(false)
      },
      error: (error) => {
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
                >Register now to get<br></br> started.</h1>
                <ul className="list-disc list-inside pl-4 mt-5 font-medium text-main hidden md:block">
                  { SignUpMessages?.map((message: string, index: number) => {
                    return <li className="mb-2" key={index}>{message}</li>
                  }) }
                </ul>
                
            </div>

            <div className='flex flex-col flex-1'>
                <div
                  className='max-w-max-sm md:px-8'
                >
                  <div className="mx-auto max-w-lg">
                    <form onSubmit={handleSignUp} className="mb-0 space-y-4 rounded-lg p-4 md:p-8 shadow-md md:shadow-lg">
                      <p className="text-2xl mb-10 text-main font-medium">Sign up</p>

                      <div>
                        <label htmlFor="email" className="text-sm font-medium">Email</label>

                        <div className="relative mt-1">
                          <input
                            type="email"
                            id="email"
                            name='email'
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
                            id="password"
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

                      <div>
                        <label htmlFor="password" className="text-sm font-medium">Confirm password</label>

                        <div className="relative mt-1">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="passwordConfirm"
                            name='passwordConfirm'
                            className="w-full rounded-lg border-gray-200 py-3 px-4 pr-12 text-sm shadow-sm"
                            placeholder="Confirm password"
                          />

                          <button
                            onClick={handleShowConfirmPassword}
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
                                showConfirmPassword
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
                      {isSuccess && <p className='text-green-500'>{successMessage}</p>}

                      <button
                        type="submit"
                        className="block w-full rounded-lg hover:bg-main bg-main px-5 py-3 text-sm font-medium text-white"
                        disabled={isFetching}
                      >
                        {isFetching ? 'Please wait...' : 'Sign up'}
                      </button>

                      <p className="text-center text-sm text-gray-500">
                        Already have an account ? {' '}
                        <Link className="underline" href="/social/login">Log in</Link>
                      </p>
                    </form>
                  </div>
                </div>
                </div>
            </div>
    </main>
  )
}
