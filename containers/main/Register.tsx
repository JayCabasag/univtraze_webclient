import { genericPostRequest } from '../../services/genericPostRequest'
import { IMAGES } from '../../utils/app_constants'
import { isEmailValid, isPasswordValid } from '@/utils/helpers'
import Image from 'next/image'
import React, { useState } from 'react'

export default function RegisterContainer() {

  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const userTypeInput = form.elements.namedItem('usertype') as HTMLInputElement
    const emailInput = form.elements.namedItem('email') as HTMLInputElement
    const passwordInput = form.elements.namedItem('password') as HTMLInputElement
    const confirmPasswordInput = form.elements.namedItem('passwordConfirm') as HTMLInputElement

    const userType = userTypeInput?.value as string ?? ''
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
          "type": userType
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

  return (
      <div className='w-full flex flex-col h-auto py-12 bg-white items-center justify-center p-4 gap-6' id='register'>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 w-full text-center py-2">Let&apos;s prevent diseases by creating an account</h1>
        <div className='w-full flex flex-col md:flex-row items-center justify-center gap-6'>
          <div className='md:w-1/3 flex items-center justify-center'>
            <Image
                src={IMAGES.REGISTER_IMAGE}
                height={500}
                width={500}
                alt={'disease prevention'}
              />
          </div>
          <form className="bg-white p-4 md:p-10 rounded-lg shadow-md w-full md:w-1/3" method='POST' onSubmit={(e: React.FormEvent<HTMLFormElement>)=> handleSignUp(e)}>
          <h1 className="text-lg md:text-2xl text-left font-bold mb-4 text-slate-600">Register</h1>
            <div className="mb-4">
              <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="email">
                Email
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300" type="email" id="email" name="email" required />
            </div>

            <div className="mb-4">
              <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="password">
                Password
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300" type="password" id="password" name="password" required />
            </div>
            
            <div className="mb-4">
              <label className="block text-slate-500 font-bold mb-2 text-sm" htmlFor="passwordConfirm">
                Confirm Password
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline text-slate-500 border-slate-300" type="password" id="passwordConfirm" name="passwordConfirm" required />
            </div>
            {isError && (
              <div className="bg-red-500 text-white text-center py-2 px-3 rounded mb-3" role="alert" id="error-message">
                {errorMessage}
              </div>
            )}
            {isSuccess && (
              <div className="bg-green-400 text-white text-center py-2 px-3 rounded mb-3" role="alert" id="error-message">
                {successMessage}
              </div>
            )}
            <button className="bg-green-500 text-white py-2 px-0 md:px-6 rounded-lg hover:bg-green-600 w-full md:max-w-max" type='submit' disabled={isFetching}>{isFetching ? 'Pease wait...': 'Sign Up'}</button>
          </form>
        </div>
      </div>
  )
}
