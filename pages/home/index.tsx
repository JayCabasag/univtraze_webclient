import HomeContainer from '@/containers/home'
import { genericPostRequest } from '@/services/genericPostRequest'
import { decodeJWT } from '@/utils/helpers'
import cookies from 'cookie'
import { GetServerSideProps } from 'next'
import React, { ReactNode } from 'react'
import DashboardPage from './[sub-pages]/dashboard'

export default function HomePage() {
  return (
    <HomeContainer>
      <DashboardPage />
    </HomeContainer>
  )
}

interface Props {
  isAuthorize: boolean,
  redirectUrl: string,
  response: any
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  let props = { isAuthorize: false, redirectUrl: '/', response: {}}  
  const cookie = cookies.parse(req.headers.cookie || '')
  const token = cookie['token']

  if(!token){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const decodedJWT = decodeJWT(token)
    const uid = decodedJWT?.result?.id as string

    await genericPostRequest({
      params: {id: uid},
      path: '/user/getUserDetailsById',
      success: (response) => {
        const isSuccess = response.success === 1
        const type = response?.type as string ?? ''
          if (isSuccess && type === ''){
            return {
              redirect: {
                destination: '/verify-account',
                permanent: false,
              },
            }
          }
          if (isSuccess && type !== ''){
            return {
              redirect: {
                destination: '/home',
                permanent: false,
              },
            }
          }
          return {
            redirect: {
              destination: '/',
              permanent: false,
            },
          }
        },
      error: (errorResponse) => {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      },
      token
    })
    
    return {
      props: props
    }
}