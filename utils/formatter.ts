export const formatToDegreesCelcius = (degrees: string) => {
    if(degrees === '0' || degrees === ''){
        return 'Not set'
    }
    return `${degrees}°C`
}