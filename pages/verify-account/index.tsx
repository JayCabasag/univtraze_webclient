import VerifyAccountContainer from "@/containers/verify-account/index";
import { genericPostRequest } from "@/services/genericPostRequest";
import { decodeJWT } from "@/utils/helpers";
import cookies from 'cookie'
import { GetServerSideProps } from "next";

export default function VerififyAccountPage(){
    return <VerifyAccountContainer />
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
      return {
        redirect: {
          destination: '/',
          permanent: true
        }
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
              redirects: {
                destination: '/verify-account',
                permanent: true
              }
            } 
          }
          if (isSuccess && type !== ''){
            return {
              redirects: {
                destination: '/home',
                permanent: true
              }
            } 
          }
          return {
            redirects: {
              destination: '/',
              permanent: true
            }
          } 
        },
      error: (errorResponse) => {
        return {
          redirects: {
            destination: '/',
            permanent: true
          }
        } 
      },
      token
    })
    
    return {
      props: props
    }
  }