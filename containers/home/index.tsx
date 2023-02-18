import { CURRENT_SERVER_DOMAIN } from '@/services/serverConfig';
import React from 'react'
import { GetServerSideProps } from 'next';
import { genericPostRequest } from '@/services/genericPostRequest';
import { decodeJWT } from '@/utils/helpers';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'

export default function HomeContainer({response, redirectUrl, isAuthorized}: {response: any, redirectUrl: string, isAuthorized: boolean}) {

  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove("token")
    localStorage.clear()
    router.replace('/')
  }

  return (
    <div className='w-full h-auto min-h-screen flex justify-center items-center'>
        <h1 className='h1'>Welcome</h1>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
