export const roundNumber = (number) => {
    return +(Math.round(number + "e+2")  + "e-2")
}