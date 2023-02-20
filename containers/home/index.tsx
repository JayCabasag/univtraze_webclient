import { CURRENT_SERVER_DOMAIN } from '@/services/serverConfig';
import React from 'react'
import { GetServerSideProps } from 'next';
import { genericPostRequest } from '@/services/genericPostRequest';
import { decodeJWT } from '@/utils/helpers';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import userStore from '@/states/user/userStates';
import Link from 'next/link';

export default function HomeContainer({response, redirectUrl, isAuthorized}: {response: any, redirectUrl: string, isAuthorized: boolean}) {
  return (
    <div className='w-full h-auto min-h-screen flex justify-center items-center'>
        <h1 className='h1'>Welcome</h1>
        <Link href={'/logout'}>
          <button>Logout</button>
        </Link>
    </div>
  )
}
