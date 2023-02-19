import VerifyAccountContainer from "@/containers/verify-account";
import { genericPostRequest } from "@/services/genericPostRequest";
import { decodeJWT } from "@/utils/helpers";
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
    const cookieToken = req.headers.cookie as string;

    if (!cookieToken){
       res.writeHead(302, {
        Location: '/'
       })
       res.end()
       return {
        props: {
          isAuthorize: true,
          redirectUrl: '/home',
          response: {}
        }
      }
    }
    const token = cookieToken.substring(6)
    const decodedJWT = decodeJWT(token)
    const uid = decodedJWT?.result?.id as string
    let props = {isAuthorize: false, redirectUrl: '/', response: {}}

    await genericPostRequest({
      params: {id: uid},
      path: '/user/getUserDetailsById',
      success: (response) => {
        const isSuccess = response.success === 1
        if (isSuccess){
          return {
            props: {
              isAuthorize: true,
              redirectUrl: '/verify-account',
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