import React, { useState, useEffect } from 'react'
import LogoutContainer from '@/containers/logout'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import userStore from '@/states/user/userStates'

export default function LogoutPage() {

  const router = useRouter()
  const { removeUserDetails } = userStore()
  const [isLoggedOutSuccess, setIsLoggedOutSuccess] = useState(false)
  const [isLoggedOutFailed, setIsLoggedOutFailed] = useState(false)
  const [isLogginOut, setIsLogginOut] = useState(true)

  useEffect(() => {
    const logoutUser = () => {
        setIsLogginOut(true)
        try {
          Cookies.remove('token')
          localStorage.clear()
          removeUserDetails()
          router.replace('/')
        } catch (error) {
          setIsLoggedOutFailed(true)
        }
        setIsLogginOut(false)
    }
    logoutUser()
  }, [])
  
  return (
    <>{isLogginOut ? <> Please wait... logging out. </> : <LogoutContainer />}</>
  )
}
