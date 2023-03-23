import { recoverPassword } from '@/api/user/recoverPasswordViaEmail'
import { resetPassword } from '@/api/user/resetPassword'
import { isPasswordValid } from '@/utils/helpers'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import React, { useState } from 'react'

export default function ForgotPassword() {

  const [email, setEmail] = useState('')
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [hasSuccess, setHasSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showRecoveryPassword, setShowRecoveryPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [recoveryPassword, setRecoveryPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const sendToEmailMutation = useMutation({
    mutationFn: () => recoverPassword(email),
    onSuccess: (response) => {
      const isSuccess = (response?.success as boolean) ?? false
      if(isSuccess){
        resetStatus()
        setShowResetPassword(true)
        return setSuccess(true, 'Recovery password has been sent to your email')
      }
      resetStatus()
      setShowResetPassword(false)
      setError(true, response?.message)
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: () => resetPassword(email, recoveryPassword, confirmPassword),
    onSuccess: (response) => {
      const isSuccess = (response?.success as boolean) ?? false
      if(isSuccess){
        resetStatus()
        return setSuccess(true, 'Successfully reset your password')
      }
      resetStatus()
      setError(true, response?.message)
    },
  })

  const setError = (status: boolean, messsage: string) =>{
    setHasError(status)
    setErrorMessage(messsage)
  }

  const setSuccess = (status: boolean, message: string) => {
    setHasSuccess(status)
    setSuccessMessage(message)
  }

  const resetStatus = () => {
    setHasSuccess(false)
    setError(false, '')
  }

  const handleSendToThisEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetStatus()
    const formElement = event?.currentTarget

    const emailElement = formElement?.elements?.namedItem('email') as HTMLInputElement
    const emailValue = emailElement?.value as string ?? ''

    if (emailValue === '') {
        return setError(true, 'Please provide your email address')
    }

    setEmail(emailValue)
    sendToEmailMutation.mutate()
  }

  const handleResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetStatus()
    const formElement = event?.currentTarget

    const recoveryPasswordElement = formElement?.elements?.namedItem('recovery-password') as HTMLInputElement
    const newPasswordElement = formElement?.elements?.namedItem('new-password') as HTMLInputElement
    const confirmPasswordElement = formElement?.elements?.namedItem('confirm-password') as HTMLInputElement

    const recoveryPasswordValue = recoveryPasswordElement?.value as string ?? ''
    const newPasswordValue = newPasswordElement?.value as string ?? ''
    const confirmPasswordValue = confirmPasswordElement?.value as string ?? ''

    setRecoveryPassword(recoveryPasswordValue)
    setConfirmPassword(confirmPasswordValue)

    if(recoveryPasswordValue === ''){
        return setError(true, 'Please provide recovery password sent to your email.')
    }

    if(newPasswordValue === ''){
        return setError(true, 'Please provide your new password.')
    }

    if(!isPasswordValid(newPasswordValue)){
        return setError(true, 'New Password is weak, make sure to add at least 8 characters, at least one lowercase letter, at least one uppercase letter, at least one digit, and at least one special character (@$!%*?&)!')
    }

    if(confirmPasswordValue === ''){
        return setError(true, 'Please confirm password.')
    }

    if(!isPasswordValid(confirmPasswordValue)){
        return setError(true, 'Confirm Password is weak, make sure to add at least 8 characters, at least one lowercase letter, at least one uppercase letter, at least one digit, and at least one special character (@$!%*?&)!')
    }

    if(confirmPasswordValue !== newPasswordValue){
        return setError(true, 'New password and confirm password dont match.')
    }

    resetPasswordMutation.mutate()
   }

  const handleShowPassword = (source: string) => {
    if(source === 'recovery-password') {
      setShowRecoveryPassword(prevState => !prevState)
    }
    if(source === 'new-password') {
      setShowNewPassword(prevState => !prevState)
    }
    if(source === 'confirm-password') {
      setShowConfirmPassword(prevState => !prevState)
    }
  }

  return (
    <main className='flex flex-col h-screen w-screen'>
        <div className='text-main font-bold text-2xl mt-4 ml-4  md:mt-11 md:ml-12 h-12'><Link href={'/'}>Univtraze</Link></div>
        <div 
          className='flex w-full max-w-max-xl self-center flex-col md:flex-row mt-10  xl:mt-16  md:mt-32 transition-all p-4'
        > 
            <div className='flex-1'>
                <h1 
                  className='text-3xl md:text-5xl text-main font-medium'
                >Forgot password?<br></br></h1>
                <p
                  className='mt-4 hidden md:block '
                >Don't have an account yet? <Link className="underline" href="/social/signup">Sign up</Link> </p>
            </div>

            <div className='flex flex-col flex-1'>
                <div
                  className='max-w-max-sm md:px-8'
                >
                  <div className="mx-auto max-w-lg">
                    <form onSubmit={showResetPassword ? handleResetPassword : handleSendToThisEmail} className="mb-0 space-y-4 rounded-lg p-4 md:p-8 shadow-md md:shadow-lg">
                      <p className="text-2xl mb-10 text-main font-medium">Please input your email</p>

                      <div>
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <div className="relative mt-1">
                          <input
                            type="email"
                            id="email"
                            name='email'
                            className="w-full rounded-lg border-gray-200 py-3 px-4 pr-12 text-sm shadow-sm"
                            placeholder="Enter email"
                            disabled={showResetPassword}
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
                      {showResetPassword && (
                        <>
                        <div>
                          <label htmlFor="recovery-password" className="text-sm font-medium">Recovery Password</label>
                          <div className="relative mt-1">
                            <input
                              type={showRecoveryPassword ? 'text' : 'password'}
                              id={"recovery-password"}
                              name='recovery-password'
                              className="w-full rounded-lg border-gray-200 py-3 px-4 pr-12 text-sm shadow-sm"
                              placeholder="Enter password"
                            />
                            <button
                              onClick={() => handleShowPassword('recovery-password')}
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
                                  showRecoveryPassword
                                    ?
                                    <>
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
                        <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                        <div className="relative mt-1">
                          <input
                            type={ showNewPassword ? 'text' : 'password' }
                            id={"new-password"}
                            name='new-password'
                            className="w-full rounded-lg border-gray-200 py-3 px-4 pr-12 text-sm shadow-sm"
                            placeholder="Enter password"
                          />
                          <button
                            onClick={() => handleShowPassword('new-password')}
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
                                showNewPassword
                                  ?
                                  <>
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
                        <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                        <div className="relative mt-1">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id={"confirm-password"}
                            name='confirm-password'
                            className="w-full rounded-lg border-gray-200 py-3 px-4 pr-12 text-sm shadow-sm"
                            placeholder="Enter password"
                          />
                          <button
                            onClick={() => handleShowPassword('confirm-password')}
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
                                  ?
                                  <>
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
                      </>
                      )}
                      <div>
                        {sendToEmailMutation.isLoading || resetPasswordMutation.isLoading && (
                        <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                            <span className="font-medium">Please wait...</span> Sending to this email...
                        </div>
                        )}
                        {hasError && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                            <span className="font-medium">Error Occured!</span> {errorMessage}
                        </div>
                        )}
                        {hasSuccess && (
                        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                            <span className="font-medium">Success!</span> {successMessage}
                        </div>
                        )}
                    </div>
                      <button
                        type="submit"
                        className="block w-full rounded-lg hover:bg-main bg-main px-5 py-3 text-sm font-medium text-white"
                        disabled={sendToEmailMutation.isLoading}
                      >
                        {showResetPassword ? 'Reset now' : 'Send to this email'}
                      </button>

                      <p className="text-center text-sm text-gray-500">
                        Return to {' '}
                        <Link className="underline" href="/social/login">login</Link>
                      </p>
                    </form>
                  </div>
                </div>
                </div>
            </div>
    </main>
  )
}
