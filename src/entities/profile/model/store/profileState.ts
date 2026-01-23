import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ProfilePersonalData, ProfileCompanyData, ProfileState } from '../types';

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
