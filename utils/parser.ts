import jwt from 'jsonwebtoken'

export const getUidFromToken = (token: string ) => {
    const decoded = jwt.decode(token) as jwt.JwtPayload
    const uid = decoded?.result?.id as number ?? undefined
    const email = decoded?.result?.email as string
    const type = decoded?.result?.type as string
    return { uid, type, email }
}