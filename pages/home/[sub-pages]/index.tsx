import HomeContainer from '@/containers/home'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import DashboardSubpage from './dashboard'
import NotificationsSubpage from './notifications'

export default function SubPage({response, redirectUrl, isAuthorized }: {response: any, redirectUrl: string, isAuthorized: boolean}) {
  const router = useRouter()
  const { query } = router
  const activeSubpage = query["sub-pages"]
  
  return (
    <HomeContainer response={response} redirectUrl={redirectUrl} isAuthorized={isAuthorized}>
        {activeSubpage === 'dashboard' && <DashboardSubpage />}
        {activeSubpage === 'notifications' && <NotificationsSubpage/>}
    </HomeContainer>
  )
}
interface Props {
    isAuthorize: boolean,
    redirectUrl: string,
    response: any
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
    let props = { isAuthorize: false, redirectUrl: '/', response: {} }
    return {
      props: props
    }
}

