import HomeContainer from '@/containers/home'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import DashboardSubpage from './dashboard'
import NotificationsSubpage from './notifications'
import UpdateProfileSubpage from './update-profile'
import RoomVisitedSubpage from './room-visited'
import cookies from 'cookie'
import VaccineInformationSubPage from './vaccine-information'
import TemperatureHistorySubPage from './temperature-history'
import { decodeJWT } from '@/utils/helpers'
import ReportDiseaseSubpage from './report-disease'
import EmergencyReportSubpage from './emergency-report'

export default function SubPage({response, redirectUrl, isAuthorized }: {response: { token: string}, redirectUrl: string, isAuthorized: boolean}) {
  const router = useRouter()
  const { query } = router
  const activeSubpage = query["sub-pages"]
  const token = response.token as string
  
  return (
    <HomeContainer>
        {activeSubpage === 'dashboard' && <DashboardSubpage />}
        {activeSubpage === 'notifications' && <NotificationsSubpage />}
        {activeSubpage === 'temperature-history' && <TemperatureHistorySubPage />}
        {activeSubpage === 'update-profile' && <UpdateProfileSubpage />}
        {activeSubpage === 'vaccine-information' && <VaccineInformationSubPage />}
        {activeSubpage === 'room-visited' && <RoomVisitedSubpage />}
        {activeSubpage === 'report-disease' && <ReportDiseaseSubpage />}
        {activeSubpage === 'emergency-report' && <EmergencyReportSubpage />}
    </HomeContainer>
  )
}
interface Props {
    isAuthorize: boolean,
    redirectUrl: string,
    response: any
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const cookie = cookies.parse(req.headers.cookie || '')
  const token = cookie['token']
  const decodedToken = decodeJWT(token)
  const type = decodedToken?.result?.type as string

  if(type === null){
    return {
      redirect: {
        destination: '/verify-account',
        permanent: true
      }
    }
  }

  let props = { isAuthorize: false, redirectUrl: '/', response: { token }}  
  if(!token){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } 
  return {
    props: props
  }
}