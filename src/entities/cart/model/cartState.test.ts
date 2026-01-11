import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  toggleCart,
  openCart,
  closeCart,
  clearCart,
} from './cartState';
import type { CartState, CartItem } from './types';

describe('cartState', () => {
  const initialState: CartState = {
    items: [],
    isOpen: false,
  };

  it('should return initial state', () => {
    expect(cartReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('addItem', () => {
    it('should add new item to cart', () => {
      const payload = {
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        article: 'ART-1',
      };

      const newState = cartReducer(initialState, addItem(payload));

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0]).toMatchObject({
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        article: 'ART-1',
        quantity: 1,
      });
      expect(newState.items[0].id).toBeDefined();
    });

    it('should increment quantity when item already exists', () => {
      const existingItem: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 2,
        article: 'ART-1',
      };

      const state: CartState = {
        items: [existingItem],
        isOpen: false,
      };

      const payload = {
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        article: 'ART-1',
      };

      const newState = cartReducer(state, addItem(payload));

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].quantity).toBe(3);
      expect(newState.items[0].id).toBe('item-1');
    });

    it('should add separate item for same product with different offer', () => {
      const existingItem: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 1,
        article: 'ART-1',
      };

      const state: CartState = {
        items: [existingItem],
        isOpen: false,
      };

      const payload = {
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-2', // Different offer
        offerName: 'Offer 2',
        price: 150,
        currency: 'RUB',
        unit: 'шт.',
        article: 'ART-1',
      };

      const newState = cartReducer(state, addItem(payload));

      expect(newState.items).toHaveLength(2);
      expect(newState.items[0].quantity).toBe(1);
      expect(newState.items[1].quantity).toBe(1);
      expect(newState.items[1].offerUuid).toBe('offer-2');
    });

    it('should generate unique id for new items', () => {
      const payload = {
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        article: 'ART-1',
      };

      const state1 = cartReducer(initialState, addItem(payload));
      const state2 = cartReducer(initialState, addItem(payload));

      expect(state1.items[0].id).not.toBe(state2.items[0].id);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart by id', () => {
      const item1: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 1,
        article: 'ART-1',
      };

      const item2: CartItem = {
        id: 'item-2',
        productUuid: 'product-2',
        productName: 'Product 2',
        productImage: '/image2.jpg',
        offerUuid: 'offer-2',
        offerName: 'Offer 2',
        price: 200,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 1,
        article: 'ART-2',
      };

      const state: CartState = {
        items: [item1, item2],
        isOpen: false,
      };

      const newState = cartReducer(state, removeItem('item-1'));

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].id).toBe('item-2');
    });

    it('should handle removing from empty cart', () => {
      const newState = cartReducer(initialState, removeItem('item-1'));

      expect(newState.items).toHaveLength(0);
    });

    it('should handle removing non-existent item', () => {
      const item: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 1,
        article: 'ART-1',
      };

      const state: CartState = {
        items: [item],
        isOpen: false,
      };

      const newState = cartReducer(state, removeItem('non-existent'));

      expect(newState.items).toHaveLength(1);
      expect(newState.items[0].id).toBe('item-1');
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity of existing item', () => {
      const item: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 2,
        article: 'ART-1',
      };

      const state: CartState = {
        items: [item],
        isOpen: false,
      };

      const newState = cartReducer(state, updateQuantity({ id: 'item-1', quantity: 5 }));

      expect(newState.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is set to 0', () => {
      const item: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 2,
        article: 'ART-1',
      };

      const state: CartState = {
        items: [item],
        isOpen: false,
      };

      const newState = cartReducer(state, updateQuantity({ id: 'item-1', quantity: 0 }));

      expect(newState.items).toHaveLength(0);
    });

    it('should not allow negative quantity and remove item when quantity becomes 0', () => {
      const item: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 2,
        article: 'ART-1',
      };

      const state: CartState = {
        items: [item],
        isOpen: false,
      };

      const newState = cartReducer(state, updateQuantity({ id: 'item-1', quantity: -5 }));

      // When quantity is negative, Math.max(0, -5) = 0, so item is removed
      expect(newState.items).toHaveLength(0);
    });

    it('should handle updating non-existent item', () => {
      const state: CartState = {
        items: [],
        isOpen: false,
      };

      const newState = cartReducer(state, updateQuantity({ id: 'non-existent', quantity: 5 }));

      expect(newState.items).toHaveLength(0);
    });

    it('should handle multiple items and update correct one', () => {
      const item1: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 2,
        article: 'ART-1',
      };

      const item2: CartItem = {
        id: 'item-2',
        productUuid: 'product-2',
        productName: 'Product 2',
        productImage: '/image2.jpg',
        offerUuid: 'offer-2',
        offerName: 'Offer 2',
        price: 200,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 3,
        article: 'ART-2',
      };

      const state: CartState = {
        items: [item1, item2],
        isOpen: false,
      };

      const newState = cartReducer(state, updateQuantity({ id: 'item-2', quantity: 10 }));

      expect(newState.items).toHaveLength(2);
      expect(newState.items[0].quantity).toBe(2);
      expect(newState.items[1].quantity).toBe(10);
    });
  });

  describe('toggleCart', () => {
    it('should toggle cart from closed to open', () => {
      const state: CartState = {
        items: [],
        isOpen: false,
      };

      const newState = cartReducer(state, toggleCart());

      expect(newState.isOpen).toBe(true);
    });

    it('should toggle cart from open to closed', () => {
      const state: CartState = {
        items: [],
        isOpen: true,
      };

      const newState = cartReducer(state, toggleCart());

      expect(newState.isOpen).toBe(false);
    });
  });

  describe('openCart', () => {
    it('should set isOpen to true', () => {
      const state: CartState = {
        items: [],
        isOpen: false,
      };

      const newState = cartReducer(state, openCart());

      expect(newState.isOpen).toBe(true);
    });

    it('should keep isOpen as true if already open', () => {
      const state: CartState = {
        items: [],
        isOpen: true,
      };

      const newState = cartReducer(state, openCart());

      expect(newState.isOpen).toBe(true);
    });
  });

  describe('closeCart', () => {
    it('should set isOpen to false', () => {
      const state: CartState = {
        items: [],
        isOpen: true,
      };

      const newState = cartReducer(state, closeCart());

      expect(newState.isOpen).toBe(false);
    });

    it('should keep isOpen as false if already closed', () => {
      const state: CartState = {
        items: [],
        isOpen: false,
      };

      const newState = cartReducer(state, closeCart());

      expect(newState.isOpen).toBe(false);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const item1: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 2,
        article: 'ART-1',
      };

      const item2: CartItem = {
        id: 'item-2',
        productUuid: 'product-2',
        productName: 'Product 2',
        productImage: '/image2.jpg',
        offerUuid: 'offer-2',
        offerName: 'Offer 2',
        price: 200,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 3,
        article: 'ART-2',
      };

      const state: CartState = {
        items: [item1, item2],
        isOpen: true,
      };

      const newState = cartReducer(state, clearCart());

      expect(newState.items).toHaveLength(0);
      expect(newState.isOpen).toBe(true); // isOpen should remain unchanged
    });

    it('should handle clearing empty cart', () => {
      const newState = cartReducer(initialState, clearCart());

      expect(newState.items).toHaveLength(0);
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state when adding item', () => {
      const state: CartState = {
        items: [],
        isOpen: false,
      };
      const originalState = { ...state, items: [...state.items] };

      const payload = {
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        article: 'ART-1',
      };

      cartReducer(state, addItem(payload));

      expect(state).toEqual(originalState);
    });

    it('should not mutate original state when removing item', () => {
      const item: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 1,
        article: 'ART-1',
      };

      const state: CartState = {
        items: [item],
        isOpen: false,
      };
      const originalState = { ...state, items: [...state.items] };

      cartReducer(state, removeItem('item-1'));

      expect(state).toEqual(originalState);
    });

    it('should not mutate original state when updating quantity', () => {
      const item: CartItem = {
        id: 'item-1',
        productUuid: 'product-1',
        productName: 'Product 1',
        productImage: '/image1.jpg',
        offerUuid: 'offer-1',
        offerName: 'Offer 1',
        price: 100,
        currency: 'RUB',
        unit: 'шт.',
        quantity: 2,
        article: 'ART-1',
      };

      const state: CartState = {
        items: [item],
        isOpen: false,
      };
      const originalState = { ...state, items: [...state.items] };

      cartReducer(state, updateQuantity({ id: 'item-1', quantity: 5 }));

      expect(state).toEqual(originalState);
    });

    it('should not mutate original state when toggling cart', () => {
      const state: CartState = {
        items: [],
        isOpen: false,
      };
      const originalState = { ...state, items: [...state.items] };

      cartReducer(state, toggleCart());

      expect(state).toEqual(originalState);
    });
  });
});
