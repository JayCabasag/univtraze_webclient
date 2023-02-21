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
      res.writeHead(302, {
        Location: '/'
      })
      res.end()
      props = { isAuthorize: false, redirectUrl: '/', response: {} }
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
              props: {
                isAuthorize: true,
                redirectUrl: '/verify-account',
                response: response
              }
            } 
          }
          if (isSuccess && type !== ''){
            res.writeHead(302, {
              Location: '/home'
            })
            res.end()
            return {
              props: {
                isAuthorize: true,
                redirectUrl: '/home',
                response: response
              }
            } 
          }
          res.writeHead(302, {
            Location: '/'
          })
          res.end()
          return {
            props: {
              isAuthorize: false,
              redirectUrl: '/',
              response: response
            }
          } 
        },
      error: (errorResponse) => {
        return {
          props: {
            isAuthorize: false,
            redirectUrl: '/',
            response: errorResponse
            }
          }
        },
      token
    })
    
    return {
      props: props
    }
  }