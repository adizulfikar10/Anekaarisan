export interface IAuth {
    phone_number: string;
    password: string;
}

export interface IAuthState {
    token: string;
    name: string;
    roles: string[];
    email: string;
    id: string;
    agent_code: string;
    token_expired: number;
    login_date: null | Date;
}
