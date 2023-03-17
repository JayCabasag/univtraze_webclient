import HomeContainer from '@/containers/home'
import { DashboardContainer, NotificationsContainer, RoomVisitedContainer, TemperatureHistoryContainer, UpdateProfileContainer, VaccineInformationContainer } from '@/containers/home/sub-pages'
import EmergencyReportContainer from '@/containers/home/sub-pages/dashboard-subpages/emergency-report'
import ReportDiseaseContainer from '@/containers/home/sub-pages/dashboard-subpages/report-disease'
import { PageProps } from '@/utils/types'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import cookies from 'cookie'
import React from 'react'
import { decodeJWT } from '@/utils/helpers'
import { genericPostRequest } from '@/services/genericPostRequest'


export default function HomePage(props : PageProps) {
  const router = useRouter()
  const { params } = router.query
  const arrayRoutes = params ?? []
  const activeSubpage = arrayRoutes[0] ?? ''

  return (
    <HomeContainer props={props}>
      {activeSubpage === ''  && <DashboardContainer props={props}/>}
      {activeSubpage === 'dashboard'  && <DashboardContainer props={props}/>}
      {activeSubpage === 'notifications' && <NotificationsContainer props={props}/>}
      {activeSubpage === 'temperature-history' && <TemperatureHistoryContainer props={props}/>}
      {activeSubpage === 'update-profile' && <UpdateProfileContainer props={props}/>}
      {activeSubpage === 'vaccine-information' && <VaccineInformationContainer props={props}/>}
      {activeSubpage === 'room-visited' && <RoomVisitedContainer props={props}/>}
      {activeSubpage === 'report-disease' && <ReportDiseaseContainer props={props}/>}
      {activeSubpage === 'emergency-report' && <EmergencyReportContainer props={props}/>}
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
