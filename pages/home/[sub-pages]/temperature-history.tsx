import { TemperatureHistoryContainer } from '@/containers/home/sub-pages'
import { PageProps } from '@/utils/types'
import React from 'react'

export default function TemperatureHistorySubPage({ props }: {props: PageProps}) {
  return <TemperatureHistoryContainer props={props}/>
}
