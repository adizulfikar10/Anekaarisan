export const formatErrorMessage = (payload: any) => {
    if (payload) {
        return {
            statusCode: payload.response.data.statusCode,
            statusText: payload.response.data.statusText,
            message: payload.response.data.message,
            //mengambil lemparan validation error from server
            errors: payload.response.data.errors
        };
    } else {
        return {
            statusCode: 0,
            statusText: "",
            message: ""
        };
    }
};

export const changeFormatNumber = (no: string) => {
    const charLength = no.length;
    if (no.charAt(0) === "0") {
        return "+62" + no.substring(1, charLength);
    } else {
        return no;
    }
}

export const formatMoney = (nominal: number) => {
    return "Rp" + nominal.toLocaleString("id-ID");
}
