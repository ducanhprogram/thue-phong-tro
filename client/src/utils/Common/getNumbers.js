export const getNumbersPrice = (string) =>
    string
        .split(" ")
        .map((item) => +item)
        .filter((item) => !item === false)
        .map((item) => item);
export const getNumbersArea = (string) =>
    string
        .split(" ")
        .map((item) => +item.match(/\d+/))
        .filter((item) => item !== 0);
