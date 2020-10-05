export const messageAPI = (subject: string, type: string) => {
    let message = "";

    switch (type) {
        case "CREATED":
            message = `${subject} berhasil dibuat.`;
            break;
        case "UPDATED":
            message = `${subject} berhasil diperbarui.`;
            break;
        case "DELETED":
            message = `${subject} berhasil dihapus.`;
            break;
        case "FETCHED":
            message = `${subject} berhasil didapat.`;
            break;
        default:
            message = `tipe tidak dikenal`;
    }

    return message;
};
