import HomeContainer from '@/containers/home'
import { genericPostRequest } from '@/services/genericPostRequest'
import { decodeJWT } from '@/utils/helpers'
import { PageProps } from '@/utils/types'
import cookies from 'cookie'
import { GetServerSideProps, GetStaticProps } from 'next'
import React, { ReactNode } from 'react'
import DashboardPage from './[sub-pages]/dashboard'


export default function HomePage(props: PageProps) {
  return (
    <HomeContainer props={props}>
      <DashboardPage props={props}/>
    </HomeContainer>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, res }) => {
  const cookie = cookies.parse(req.headers.cookie || '')
  const token = cookie['token']
  const decodedToken = decodeJWT(token)
  const type = decodedToken?.result?.type as string
  const props = { token : token } 
  if(type === null){
    return {
      redirect: {
        destination: '/verify-account',
        permanent: true
      }
    }
  }
  
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