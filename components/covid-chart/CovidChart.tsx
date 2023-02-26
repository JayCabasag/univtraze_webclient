import { CovidCaseType } from '@/utils/types';
import { AreaChart,Bar,Legend, CartesianGrid, Line, LineChart, XAxis, YAxis, Area, Tooltip, BarChart, ResponsiveContainer } from "recharts"
import React, { useRef, useEffect, useState } from 'react';

function CovidChart({ allCasesList, allRecoveredList, allDeathCaseList} : { allCasesList: CovidCaseType[], allRecoveredList:  CovidCaseType[]; allDeathCaseList: CovidCaseType[]}) {

  const mappedAllCaseList = new Map<string, CovidCaseType>()
  allCasesList?.forEach((caseList: CovidCaseType) => {
    mappedAllCaseList.set(caseList?.date as string, caseList as CovidCaseType)
  })
  const allCasesArray = Array.from(mappedAllCaseList.values())
  const mappedAllRecoveredCaseList = new Map<string, CovidCaseType>()
  allRecoveredList?.forEach((caseList: CovidCaseType) => {
    mappedAllRecoveredCaseList.set(caseList?.date as string, caseList as CovidCaseType)
  })
  const allRecoveredCasesArray = Array.from(mappedAllRecoveredCaseList.values())
  const mappedAllDeathsCaseList = new Map<string, CovidCaseType>()
  allDeathCaseList?.forEach((caseList: CovidCaseType) => {
    mappedAllDeathsCaseList.set(caseList?.date as string, caseList as CovidCaseType)
  })
  const allDeathsCasesArray = Array.from(mappedAllDeathsCaseList.values())
  const lastTwelveMonthsDataCases = allCasesArray?.slice(-12)
  const lastTwelveMonthsDataRecoveredCases = allRecoveredCasesArray?.slice(-12)
  const lastTwelveMonthsDataDeathsCases = allDeathsCasesArray?.slice(-12)
  let dataForChart = []

  for (let i = 0; i < lastTwelveMonthsDataCases.length; i++) {
    const { date } = lastTwelveMonthsDataCases[i];
    const arrayOneTotalCase = lastTwelveMonthsDataCases[i].totalCase;
    const arrayTwoTotalCase = lastTwelveMonthsDataRecoveredCases[i].totalCase;
    const arrayThreeTotalCase = lastTwelveMonthsDataDeathsCases[i].totalCase;
   dataForChart.push({ date, cases: arrayOneTotalCase, recovered: arrayTwoTotalCase, deaths: arrayThreeTotalCase })
  }
  return (
    <ResponsiveContainer width={'100%'} height={250}>
      <BarChart data={dataForChart}>
        <XAxis dataKey="date" />
        <Tooltip />
        <Legend />
        <Bar name="Cases" type="monotone" dataKey="cases" fill="#ff6666" />
        <Bar name="Recovered" type="monotone" dataKey="recovered" fill="#34495E" />
        <Bar name="Deaths" type="monotone" dataKey="deaths" fill="#4CAF50" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default CovidChart;
