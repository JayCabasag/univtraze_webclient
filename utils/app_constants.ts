import { CovidCaseType } from "./types"

export const IMAGES = {
    UNIVTRAZE_LOGO_WITH_TEXT: '/assets/logoWithText.png',
    CLOSE_ICON: '/assets/closeIcon.svg',
    CLOSE_BLACK_ICON: '/assets/closeBlack.svg',
    MENU_ICON: '/assets/menuIcon.svg',
    BACKGOUND_IMAGE: '/assets/bg.png',
    HOME_WELCOME_IMAGE: '/assets/5876.jpg',
    REGISTER_IMAGE: '/assets/3685432.jpg',
    BACK_TO_TOP_ICON_SVG: '/assets/backToTopIcon.svg',
    ACTIVE_CASES: '/assets/activeCases.svg',
    USERS: '/assets/users.svg',
    VIRUS: '/assets/virus.svg',
    LOGOUT: '/assets/logoutRoundedIcon.png',
    DEFAULT_PROFILE_PHOTO: 'https://firebasestorage.googleapis.com/v0/b/univtraze-app-web.appspot.com/o/cdn%2Fuser.png?alt=media&token=c21e9632-799b-430d-ac67-946aab287fa8'
}

export const COLORS = {
    MAIN_GREEN: '#256676',
    DARKER_GREEN: '#28cd93',
    TEXT_GRAY: '#727586',
    TEXT_BLACK: '#679963'
}

export enum UserTypes {
    STUDENT = 'student',
    VISITOR = 'visitor',
    EMPLOYEE = 'employee'
}

export enum CommunicableDiseaseTypes {
    DEFAULT_VALUE = 'Select disease name',
    COVID_19 = 'Covid-19',
    MONKEY_POX = 'Monkey Pox',
    TUBERCULOSIS = 'Tuberculosis',
    OTHERS = 'Others'
}

export enum EmergencyReportSymptoms {
    DEFAULT = "Select a symptom",
    FEVER = "Fever",
    COUGH_OR_COLDS = "Cough or Colds",
    SORE_THROAT = "Sore throat",
    LOSS_OF_SMELL_OR_TASTE = "Loss of smell or taste",
    BODY_PAINS_OR_FATIGUES = "Body pains or fatigues",
    DIARRHEA = "Diarrhea",
    OTHERS = 'Others'
  }

export const CONTAINER_WIDTH = '1090px'

export const UserTypeList = Object.values(UserTypes)

export const formattedCovidCasesList = (allCases: any[]) => {
    if(allCases?.length <= 0) return [] as CovidCaseType[]
    
    const allCasesList = Object.entries(allCases)?.map(([key, value]) => {
        const splittedData = key.split("/")
        const month = splittedData[0]
        const year = splittedData[2]
        return { date: `${month}-${year}`, totalCase: value }
    }) as CovidCaseType[]

    return allCasesList as CovidCaseType[]
}

export const MAX_INITIAL_LOAD = 20