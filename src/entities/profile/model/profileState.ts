import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const initialState: ProfileState = {
  personalData: {
    fullName: 'Иванов Иван Иванович',
    email: 'ivan.ivanov@example.com',
    phone: '+7 (999) 123-45-67',
    position: 'Менеджер по закупкам',
  },
  companyData: {
    name: 'ООО "ПримерКомпани"',
    inn: '7700123456',
    kpp: '770001001',
    address: 'г. Москва, ул. Примерная, д. 1, офис 101',
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updatePersonalData: (state, action: PayloadAction<Partial<ProfilePersonalData>>) => {
      state.personalData = { ...state.personalData, ...action.payload };
    },
    updateCompanyData: (state, action: PayloadAction<Partial<ProfileCompanyData>>) => {
      state.companyData = { ...state.companyData, ...action.payload };
    },
  },
});

export const { updatePersonalData, updateCompanyData } = profileSlice.actions;
export default profileSlice.reducer;
