const LONG_MONTH = [
    "JANUARI",
    "FEBRUARI",
    "MARET",
    "APRIL",
    "MEI",
    "JUNI",
    "JULI",
    "AGUSTUS",
    "SEPTEMBER",
    "OKTOBER",
    "NOVEMBER",
    "DESEMBER"
];

const SHORT_MONTH = [
    "JAN",
    "FEB",
    "MAR",
    "APRIL",
    "MEI",
    "JUN",
    "JUL",
    "AGU",
    "SEP",
    "OKT",
    "NOV",
    "DES"
];

export const dateTimeTransaction = (date: Date, type: string) => {
    const numberOfDate = date.getDate();
    const numberOfMonth = date.getMonth();
    const numberOFYear = date.getFullYear();
    const numberOfHour = date.getHours();
    const numberOfMinute = date.getMinutes();

    return (
        numberOfDate +
        " " +
        (type === "SHORT"
            ? SHORT_MONTH[numberOfMonth]
            : LONG_MONTH[numberOfMonth]) +
        " " +
        numberOFYear +
        " | " +
        numberOfHour +
        ":" +
        numberOfMinute
    );
};
