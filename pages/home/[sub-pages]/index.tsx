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
import { PageProps } from '@/utils/types';

export default function SubPage(props: PageProps) {
  const router = useRouter()
  const { query } = router
  const activeSubpage = query["sub-pages"]

  return (
    <HomeContainer props={props}>
        {activeSubpage === 'dashboard' && <DashboardSubpage props={props} />}
        {activeSubpage === 'notifications' && <NotificationsSubpage props={props}/>}
        {activeSubpage === 'temperature-history' && <TemperatureHistorySubPage props={props}/>}
        {activeSubpage === 'update-profile' && <UpdateProfileSubpage props={props}/>}
        {activeSubpage === 'vaccine-information' && <VaccineInformationSubPage props={props}/>}
        {activeSubpage === 'room-visited' && <RoomVisitedSubpage props={props}/>}
        {activeSubpage === 'report-disease' && <ReportDiseaseSubpage props={props}/>}
        {activeSubpage === 'emergency-report' && <EmergencyReportSubpage props={props}/>}
    </HomeContainer>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, res }) => {
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

  let props = { token }  
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