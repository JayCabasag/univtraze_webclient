import HomeContainer from '@/containers/home'
import { genericPostRequest } from '@/services/genericPostRequest'
import { decodeJWT } from '@/utils/helpers'
import { GetServerSideProps } from 'next'
import React from 'react'

export default function HomePage({response, redirectUrl, isAuthorized}: {response: any, redirectUrl: string, isAuthorized: boolean}) {
  return <HomeContainer response={response} redirectUrl={redirectUrl} isAuthorized={isAuthorized} />
}

interface Props {
  isAuthorize: boolean,
  redirectUrl: string,
  response: any
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const cookieToken = req.headers.cookie as string;
  if (!cookieToken){
     res.writeHead(302, {
      Location: '/'
     })
     res.end()
     return {
      props: {
        isAuthorize: true,
        redirectUrl: '/home',
        response: {}
      }
    }
  }
  const token = cookieToken.substring(6)
  const decodedJWT = decodeJWT(token)
  const uid = decodedJWT?.result?.id as string
  let props = {isAuthorize: false, redirectUrl: '/', response: {}}

  await genericPostRequest({
    params: { id: uid },
    path: '/user/getUserDetailsById',
    success: (response) => {
      const isSuccess = response.success === 1
      if (isSuccess){
        const type = response.type as string
        if(type){
          return {
            props: {
              isAuthorize: true,
              redirectUrl: '/home',
              response: response
            }
          }
        }
        res.writeHead(302, {
          Location: '/verify-account'
        });
        res.end()
        return {
          props: {
            isAuthorize: false,
            redirectUrl: '/verify-account',
            response: response
          }
        } 
      }
    },
    error: (errorResponse) => {
      return {
        props: {
          isAuthorize: false,
          redirectUrl: '/',
          response: errorResponse
        }
      }
    },
    token
  })

  return {
    props: props
  }
}