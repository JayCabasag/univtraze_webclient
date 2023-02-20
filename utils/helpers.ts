import jwt, { Secret } from "jsonwebtoken";
import moment from 'moment'

export function isEmailValid(email: string) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

export function isPasswordValid(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

export function decodeJWT(token: string){
  let decoded: any = {}
  try {
    decoded = jwt.verify(token, process.env.JSON_KEY as Secret);
  } catch (error) {
    decoded = {message: 'unable to decode token'}
  }
  return decoded
}

export function getTotalYearsFromNow(dateValue: string){
  const now = moment();
  const date = moment(dateValue);
  const years = now.diff(date, 'years');
  return years
}