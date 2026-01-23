import profileReducer, {
  updatePersonalData,
  updateCompanyData,
} from './profileState';
import type { ProfileState, ProfilePersonalData, ProfileCompanyData } from '../types';

describe('profileState', () => {
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

  it('should return initial state', () => {
    expect(profileReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('updatePersonalData', () => {
    it('should update single field in personalData', () => {
      const newState = profileReducer(
        initialState,
        updatePersonalData({ fullName: 'Петров Петр Петрович' })
      );

      expect(newState.personalData.fullName).toBe('Петров Петр Петрович');
      expect(newState.personalData.email).toBe(initialState.personalData.email);
      expect(newState.personalData.phone).toBe(initialState.personalData.phone);
      expect(newState.personalData.position).toBe(initialState.personalData.position);
      expect(newState.companyData).toEqual(initialState.companyData);
    });

    it('should update multiple fields in personalData', () => {
      const updates: Partial<ProfilePersonalData> = {
        fullName: 'Сидоров Сидор Сидорович',
        email: 'sidor.sidorov@example.com',
        phone: '+7 (999) 999-99-99',
      };

      const newState = profileReducer(initialState, updatePersonalData(updates));

      expect(newState.personalData.fullName).toBe('Сидоров Сидор Сидорович');
      expect(newState.personalData.email).toBe('sidor.sidorov@example.com');
      expect(newState.personalData.phone).toBe('+7 (999) 999-99-99');
      expect(newState.personalData.position).toBe(initialState.personalData.position);
      expect(newState.companyData).toEqual(initialState.companyData);
    });

    it('should update all fields in personalData', () => {
      const updates: ProfilePersonalData = {
        fullName: 'Новое Имя',
        email: 'new@example.com',
        phone: '+7 (999) 111-11-11',
        position: 'Директор',
      };

      const newState = profileReducer(initialState, updatePersonalData(updates));

      expect(newState.personalData).toEqual(updates);
      expect(newState.companyData).toEqual(initialState.companyData);
    });

    it('should update email field only', () => {
      const newState = profileReducer(
        initialState,
        updatePersonalData({ email: 'newemail@example.com' })
      );

      expect(newState.personalData.email).toBe('newemail@example.com');
      expect(newState.personalData.fullName).toBe(initialState.personalData.fullName);
      expect(newState.personalData.phone).toBe(initialState.personalData.phone);
      expect(newState.personalData.position).toBe(initialState.personalData.position);
    });

    it('should update phone field only', () => {
      const newState = profileReducer(
        initialState,
        updatePersonalData({ phone: '+7 (999) 888-88-88' })
      );

      expect(newState.personalData.phone).toBe('+7 (999) 888-88-88');
      expect(newState.personalData.fullName).toBe(initialState.personalData.fullName);
      expect(newState.personalData.email).toBe(initialState.personalData.email);
      expect(newState.personalData.position).toBe(initialState.personalData.position);
    });

    it('should update position field only', () => {
      const newState = profileReducer(
        initialState,
        updatePersonalData({ position: 'Генеральный директор' })
      );

      expect(newState.personalData.position).toBe('Генеральный директор');
      expect(newState.personalData.fullName).toBe(initialState.personalData.fullName);
      expect(newState.personalData.email).toBe(initialState.personalData.email);
      expect(newState.personalData.phone).toBe(initialState.personalData.phone);
    });

    it('should not affect companyData when updating personalData', () => {
      const newState = profileReducer(
        initialState,
        updatePersonalData({ fullName: 'Новое имя' })
      );

      expect(newState.companyData).toEqual(initialState.companyData);
    });

    it('should handle empty partial update', () => {
      const newState = profileReducer(initialState, updatePersonalData({}));

      expect(newState.personalData).toEqual(initialState.personalData);
      expect(newState.companyData).toEqual(initialState.companyData);
    });
  });

  describe('updateCompanyData', () => {
    it('should update single field in companyData', () => {
      const newState = profileReducer(
        initialState,
        updateCompanyData({ name: 'ООО "НоваяКомпания"' })
      );

      expect(newState.companyData.name).toBe('ООО "НоваяКомпания"');
      expect(newState.companyData.inn).toBe(initialState.companyData.inn);
      expect(newState.companyData.kpp).toBe(initialState.companyData.kpp);
      expect(newState.companyData.address).toBe(initialState.companyData.address);
      expect(newState.personalData).toEqual(initialState.personalData);
    });

    it('should update multiple fields in companyData', () => {
      const updates: Partial<ProfileCompanyData> = {
        name: 'ООО "ДругаяКомпания"',
        inn: '1234567890',
        kpp: '123456789',
      };

      const newState = profileReducer(initialState, updateCompanyData(updates));

      expect(newState.companyData.name).toBe('ООО "ДругаяКомпания"');
      expect(newState.companyData.inn).toBe('1234567890');
      expect(newState.companyData.kpp).toBe('123456789');
      expect(newState.companyData.address).toBe(initialState.companyData.address);
      expect(newState.personalData).toEqual(initialState.personalData);
    });

    it('should update all fields in companyData', () => {
      const updates: ProfileCompanyData = {
        name: 'ООО "ПолностьюНовая"',
        inn: '9876543210',
        kpp: '987654321',
        address: 'г. Санкт-Петербург, ул. Новая, д. 2, офис 202',
      };

      const newState = profileReducer(initialState, updateCompanyData(updates));

      expect(newState.companyData).toEqual(updates);
      expect(newState.personalData).toEqual(initialState.personalData);
    });

    it('should update inn field only', () => {
      const newState = profileReducer(
        initialState,
        updateCompanyData({ inn: '1111111111' })
      );

      expect(newState.companyData.inn).toBe('1111111111');
      expect(newState.companyData.name).toBe(initialState.companyData.name);
      expect(newState.companyData.kpp).toBe(initialState.companyData.kpp);
      expect(newState.companyData.address).toBe(initialState.companyData.address);
    });

    it('should update kpp field only', () => {
      const newState = profileReducer(
        initialState,
        updateCompanyData({ kpp: '222222222' })
      );

      expect(newState.companyData.kpp).toBe('222222222');
      expect(newState.companyData.name).toBe(initialState.companyData.name);
      expect(newState.companyData.inn).toBe(initialState.companyData.inn);
      expect(newState.companyData.address).toBe(initialState.companyData.address);
    });

    it('should update address field only', () => {
      const newState = profileReducer(
        initialState,
        updateCompanyData({ address: 'г. Казань, ул. Центральная, д. 5' })
      );

      expect(newState.companyData.address).toBe('г. Казань, ул. Центральная, д. 5');
      expect(newState.companyData.name).toBe(initialState.companyData.name);
      expect(newState.companyData.inn).toBe(initialState.companyData.inn);
      expect(newState.companyData.kpp).toBe(initialState.companyData.kpp);
    });

    it('should not affect personalData when updating companyData', () => {
      const newState = profileReducer(
        initialState,
        updateCompanyData({ name: 'Новая компания' })
      );

      expect(newState.personalData).toEqual(initialState.personalData);
    });

    it('should handle empty partial update', () => {
      const newState = profileReducer(initialState, updateCompanyData({}));

      expect(newState.companyData).toEqual(initialState.companyData);
      expect(newState.personalData).toEqual(initialState.personalData);
    });
  });

  describe('combined updates', () => {
    it('should handle sequential personalData updates', () => {
      const state1 = profileReducer(
        initialState,
        updatePersonalData({ fullName: 'Имя 1' })
      );
      const state2 = profileReducer(
        state1,
        updatePersonalData({ email: 'email1@example.com' })
      );
      const state3 = profileReducer(
        state2,
        updatePersonalData({ phone: '+7 (999) 111-11-11' })
      );

      expect(state3.personalData.fullName).toBe('Имя 1');
      expect(state3.personalData.email).toBe('email1@example.com');
      expect(state3.personalData.phone).toBe('+7 (999) 111-11-11');
      expect(state3.personalData.position).toBe(initialState.personalData.position);
    });

    it('should handle sequential companyData updates', () => {
      const state1 = profileReducer(
        initialState,
        updateCompanyData({ name: 'Компания 1' })
      );
      const state2 = profileReducer(
        state1,
        updateCompanyData({ inn: '1111111111' })
      );
      const state3 = profileReducer(
        state2,
        updateCompanyData({ kpp: '222222222' })
      );

      expect(state3.companyData.name).toBe('Компания 1');
      expect(state3.companyData.inn).toBe('1111111111');
      expect(state3.companyData.kpp).toBe('222222222');
      expect(state3.companyData.address).toBe(initialState.companyData.address);
    });

    it('should handle mixed updates (personalData and companyData)', () => {
      const state1 = profileReducer(
        initialState,
        updatePersonalData({ fullName: 'Новое имя' })
      );
      const state2 = profileReducer(
        state1,
        updateCompanyData({ name: 'Новая компания' })
      );

      expect(state2.personalData.fullName).toBe('Новое имя');
      expect(state2.companyData.name).toBe('Новая компания');
      expect(state2.personalData.email).toBe(initialState.personalData.email);
      expect(state2.companyData.inn).toBe(initialState.companyData.inn);
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state when updating personalData', () => {
      const state: ProfileState = {
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
      const originalState = {
        personalData: { ...state.personalData },
        companyData: { ...state.companyData },
      };

      profileReducer(state, updatePersonalData({ fullName: 'Новое имя' }));

      expect(state).toEqual(originalState);
    });

    it('should not mutate original state when updating companyData', () => {
      const state: ProfileState = {
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
      const originalState = {
        personalData: { ...state.personalData },
        companyData: { ...state.companyData },
      };

      profileReducer(state, updateCompanyData({ name: 'Новая компания' }));

      expect(state).toEqual(originalState);
    });
  });

  describe('edge cases', () => {
    it('should handle updating with empty strings', () => {
      const newState = profileReducer(
        initialState,
        updatePersonalData({ fullName: '' })
      );

      expect(newState.personalData.fullName).toBe('');
      expect(newState.personalData.email).toBe(initialState.personalData.email);
    });

    it('should handle updating with special characters', () => {
      const newState = profileReducer(
        initialState,
        updatePersonalData({ 
          fullName: 'Иванов-Петров И.И.',
          email: 'test+tag@example.com',
          phone: '+7 (999) 123-45-67',
        })
      );

      expect(newState.personalData.fullName).toBe('Иванов-Петров И.И.');
      expect(newState.personalData.email).toBe('test+tag@example.com');
    });

    it('should handle updating company data with special characters', () => {
      const newState = profileReducer(
        initialState,
        updateCompanyData({ 
          name: 'ООО "Компания & Партнеры"',
          address: 'г. Москва, ул. Ленина, д. 10/2, офис "А"',
        })
      );

      expect(newState.companyData.name).toBe('ООО "Компания & Партнеры"');
      expect(newState.companyData.address).toBe('г. Москва, ул. Ленина, д. 10/2, офис "А"');
    });

    it('should handle very long strings', () => {
      const longString = 'A'.repeat(1000);
      const newState = profileReducer(
        initialState,
        updatePersonalData({ fullName: longString })
      );

      expect(newState.personalData.fullName).toBe(longString);
      expect(newState.personalData.fullName.length).toBe(1000);
    });
  });
});
