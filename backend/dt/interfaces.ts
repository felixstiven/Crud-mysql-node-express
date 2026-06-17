//Interfaces propsUser
export interface IUser{
    company:ICompany;
    firstName: string;
    secondName?: string;
    firstLastName: string;
    secondLastName?: string;
    email: string;
    password: string;
    role: "owner" | "tecnico" | "supervisor" | "admin";
    isActive: boolean;
}

export interface ILogin{
    email:string;
    password:string;
}

export interface ICompany{
    companyName:string;
    trialExpiresAt: Date | string;
}