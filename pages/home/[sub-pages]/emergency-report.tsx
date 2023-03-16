import EmergencyReportContainer from '@/containers/home/sub-pages/emergency-report'
import { PageProps } from '@/utils/types'
import React from 'react'

export default function EmergencyReportSubpage({ props }: {props: PageProps}) {
  return <EmergencyReportContainer props={props}/>
}
