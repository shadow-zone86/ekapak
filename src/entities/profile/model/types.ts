export interface ProfilePersonalData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
}

export interface ProfileCompanyData {
  name: string;
  inn: string;
  kpp: string;
  address: string;
}

export interface ProfileState {
  personalData: ProfilePersonalData;
  companyData: ProfileCompanyData;
}
