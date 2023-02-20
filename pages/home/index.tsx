import HomeContainer from '@/containers/home'
import cookies from 'cookie'
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
  
  let props = { isAuthorize: false, redirectUrl: '/', response: {} }  
  const cookie = cookies.parse(req.headers.cookie || '')
  const token = cookie['token']

  if(!token){
    res.writeHead(302, {
      Location: '/'
    })
    res.end()
    props = { isAuthorize: false, redirectUrl: '/', response: {} }
  }

  return {
    props: props
  }
}