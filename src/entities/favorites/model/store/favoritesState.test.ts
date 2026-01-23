import favoritesReducer, { toggleFavorite, addFavorite, removeFavorite } from './favoritesState';
import type { FavoritesState } from '../types';

describe('favoritesState', () => {
  const initialState: FavoritesState = {
    productUuids: [],
  };

  it('should return initial state', () => {
    expect(favoritesReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('toggleFavorite', () => {
    it('should add product UUID when not in favorites', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2'],
      };

      const newState = favoritesReducer(state, toggleFavorite('product-3'));

      expect(newState.productUuids).toEqual(['product-1', 'product-2', 'product-3']);
      expect(newState.productUuids).toHaveLength(3);
    });

    it('should remove product UUID when already in favorites', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2', 'product-3'],
      };

      const newState = favoritesReducer(state, toggleFavorite('product-2'));

      expect(newState.productUuids).toEqual(['product-1', 'product-3']);
      expect(newState.productUuids).toHaveLength(2);
      expect(newState.productUuids).not.toContain('product-2');
    });

    it('should handle toggling the first item', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2'],
      };

      const newState = favoritesReducer(state, toggleFavorite('product-1'));

      expect(newState.productUuids).toEqual(['product-2']);
      expect(newState.productUuids).not.toContain('product-1');
    });

    it('should handle toggling the last item', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2'],
      };

      const newState = favoritesReducer(state, toggleFavorite('product-2'));

      expect(newState.productUuids).toEqual(['product-1']);
      expect(newState.productUuids).not.toContain('product-2');
    });

    it('should handle toggling when favorites list is empty', () => {
      const newState = favoritesReducer(initialState, toggleFavorite('product-1'));

      expect(newState.productUuids).toEqual(['product-1']);
      expect(newState.productUuids).toHaveLength(1);
    });

    it('should handle toggling the same product twice', () => {
      const state: FavoritesState = {
        productUuids: ['product-1'],
      };

      const newState1 = favoritesReducer(state, toggleFavorite('product-1'));
      expect(newState1.productUuids).toEqual([]);

      const newState2 = favoritesReducer(newState1, toggleFavorite('product-1'));
      expect(newState2.productUuids).toEqual(['product-1']);
    });

    it('should handle UUIDs with special characters', () => {
      const specialUuid = 'product-123-abc-def-456';
      const newState = favoritesReducer(initialState, toggleFavorite(specialUuid));

      expect(newState.productUuids).toContain(specialUuid);
    });
  });

  describe('addFavorite', () => {
    it('should add product UUID when not in favorites', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2'],
      };

      const newState = favoritesReducer(state, addFavorite('product-3'));

      expect(newState.productUuids).toEqual(['product-1', 'product-2', 'product-3']);
      expect(newState.productUuids).toHaveLength(3);
    });

    it('should not add product UUID when already in favorites', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2'],
      };

      const newState = favoritesReducer(state, addFavorite('product-2'));

      expect(newState.productUuids).toEqual(['product-1', 'product-2']);
      expect(newState.productUuids).toHaveLength(2);
    });

    it('should handle adding to empty favorites list', () => {
      const newState = favoritesReducer(initialState, addFavorite('product-1'));

      expect(newState.productUuids).toEqual(['product-1']);
      expect(newState.productUuids).toHaveLength(1);
    });

    it('should handle adding multiple favorites sequentially', () => {
      let state = initialState;

      state = favoritesReducer(state, addFavorite('product-1'));
      expect(state.productUuids).toEqual(['product-1']);

      state = favoritesReducer(state, addFavorite('product-2'));
      expect(state.productUuids).toEqual(['product-1', 'product-2']);

      state = favoritesReducer(state, addFavorite('product-3'));
      expect(state.productUuids).toEqual(['product-1', 'product-2', 'product-3']);
    });

    it('should not duplicate when adding the same product multiple times', () => {
      let state: FavoritesState = {
        productUuids: ['product-1'],
      };

      state = favoritesReducer(state, addFavorite('product-1'));
      expect(state.productUuids).toEqual(['product-1']);

      state = favoritesReducer(state, addFavorite('product-1'));
      expect(state.productUuids).toEqual(['product-1']);
      expect(state.productUuids).toHaveLength(1);
    });
  });

  describe('removeFavorite', () => {
    it('should remove product UUID from favorites', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2', 'product-3'],
      };

      const newState = favoritesReducer(state, removeFavorite('product-2'));

      expect(newState.productUuids).toEqual(['product-1', 'product-3']);
      expect(newState.productUuids).not.toContain('product-2');
    });

    it('should handle removing the first item', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2', 'product-3'],
      };

      const newState = favoritesReducer(state, removeFavorite('product-1'));

      expect(newState.productUuids).toEqual(['product-2', 'product-3']);
      expect(newState.productUuids).not.toContain('product-1');
    });

    it('should handle removing the last item', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2'],
      };

      const newState = favoritesReducer(state, removeFavorite('product-2'));

      expect(newState.productUuids).toEqual(['product-1']);
      expect(newState.productUuids).not.toContain('product-2');
    });

    it('should handle removing from empty favorites list', () => {
      const newState = favoritesReducer(initialState, removeFavorite('product-1'));

      expect(newState.productUuids).toEqual([]);
      expect(newState.productUuids).toHaveLength(0);
    });

    it('should handle removing non-existent product UUID', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2'],
      };

      const newState = favoritesReducer(state, removeFavorite('product-999'));

      expect(newState.productUuids).toEqual(['product-1', 'product-2']);
      expect(newState.productUuids).toHaveLength(2);
    });

    it('should handle removing all items one by one', () => {
      let state: FavoritesState = {
        productUuids: ['product-1', 'product-2', 'product-3'],
      };

      state = favoritesReducer(state, removeFavorite('product-1'));
      expect(state.productUuids).toEqual(['product-2', 'product-3']);

      state = favoritesReducer(state, removeFavorite('product-2'));
      expect(state.productUuids).toEqual(['product-3']);

      state = favoritesReducer(state, removeFavorite('product-3'));
      expect(state.productUuids).toEqual([]);
      expect(state.productUuids).toHaveLength(0);
    });

    it('should handle removing single item from list', () => {
      const state: FavoritesState = {
        productUuids: ['product-1'],
      };

      const newState = favoritesReducer(state, removeFavorite('product-1'));

      expect(newState.productUuids).toEqual([]);
      expect(newState.productUuids).toHaveLength(0);
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state when adding favorite', () => {
      const state: FavoritesState = {
        productUuids: ['product-1'],
      };
      const originalState = { ...state, productUuids: [...state.productUuids] };

      favoritesReducer(state, addFavorite('product-2'));

      expect(state).toEqual(originalState);
    });

    it('should not mutate original state when removing favorite', () => {
      const state: FavoritesState = {
        productUuids: ['product-1', 'product-2'],
      };
      const originalState = { ...state, productUuids: [...state.productUuids] };

      favoritesReducer(state, removeFavorite('product-1'));

      expect(state).toEqual(originalState);
    });

    it('should not mutate original state when toggling favorite', () => {
      const state: FavoritesState = {
        productUuids: ['product-1'],
      };
      const originalState = { ...state, productUuids: [...state.productUuids] };

      favoritesReducer(state, toggleFavorite('product-1'));

      expect(state).toEqual(originalState);
    });
  });
});
