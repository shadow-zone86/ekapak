import { container, createToken, resolveOr } from './container';

describe('DIContainer', () => {
  beforeEach(() => {
    container.clear();
  });

  describe('createToken', () => {
    it('should create a unique token', () => {
      const token1 = createToken<string>('MyService');
      const token2 = createToken<string>('MyService');

      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2);
    });

    it('should create tokens with different names', () => {
      const token1 = createToken('Service1');
      const token2 = createToken('Service2');

      expect(String(token1)).toContain('Service1');
      expect(String(token2)).toContain('Service2');
    });
  });

  describe('registerFactory', () => {
    it('should register a factory function', () => {
      const token = createToken<string>('TestService');
      const factory = jest.fn(() => 'test-value');

      container.registerFactory(token, factory);

      expect(factory).not.toHaveBeenCalled();
    });

    it('should create instance using factory on resolve', () => {
      const token = createToken<string>('TestService');
      const factory = jest.fn(() => 'factory-result');

      container.registerFactory(token, factory);
      const result = container.resolve(token);

      expect(factory).toHaveBeenCalledTimes(1);
      expect(result).toBe('factory-result');
    });

    it('should create new instance each time for factory', () => {
      const token = createToken<{ id: number }>('TestService');
      let counter = 0;
      const factory = jest.fn(() => ({ id: ++counter }));

      container.registerFactory(token, factory);

      const result1 = container.resolve(token);
      const result2 = container.resolve(token);

      expect(factory).toHaveBeenCalledTimes(2);
      expect(result1?.id).toBe(1);
      expect(result2?.id).toBe(2);
      expect(result1).not.toBe(result2);
    });
  });

  describe('registerSingleton', () => {
    it('should register a singleton instance', () => {
      const token = createToken<string>('TestService');
      const instance = 'singleton-instance';

      container.registerSingleton(token, instance);

      expect(container.resolve(token)).toBe(instance);
    });

    it('should return the same instance on multiple resolves', () => {
      const token = createToken<{ id: number }>('TestService');
      const instance = { id: 42 };

      container.registerSingleton(token, instance);

      const result1 = container.resolve(token);
      const result2 = container.resolve(token);

      expect(result1).toBe(instance);
      expect(result2).toBe(instance);
      expect(result1).toBe(result2);
    });
  });

  describe('resolve', () => {
    it('should return undefined if token not registered', () => {
      const token = createToken<string>('UnregisteredService');

      const result = container.resolve(token);

      expect(result).toBeUndefined();
    });

    it('should resolve factory-registered token', () => {
      const token = createToken<string>('TestService');
      container.registerFactory(token, () => 'factory-result');

      const result = container.resolve(token);

      expect(result).toBe('factory-result');
    });

    it('should resolve singleton-registered token', () => {
      const token = createToken<string>('TestService');
      container.registerSingleton(token, 'singleton-result');

      const result = container.resolve(token);

      expect(result).toBe('singleton-result');
    });

    it('should prefer singleton over factory if both registered', () => {
      const token = createToken<string>('TestService');
      const singleton = 'singleton-value';
      const factory = jest.fn(() => 'factory-value');

      container.registerFactory(token, factory);
      container.registerSingleton(token, singleton);

      const result = container.resolve(token);

      expect(result).toBe(singleton);
      expect(factory).not.toHaveBeenCalled();
    });
  });

  describe('resolveRequired', () => {
    it('should throw error if token not registered', () => {
      const token = createToken<string>('UnregisteredService');

      expect(() => {
        container.resolveRequired(token);
      }).toThrow('Dependency with token');
    });

    it('should return instance if token is registered', () => {
      const token = createToken<string>('TestService');
      container.registerSingleton(token, 'registered-value');

      const result = container.resolveRequired(token);

      expect(result).toBe('registered-value');
    });

    it('should use custom error message', () => {
      const token = createToken<string>('UnregisteredService');

      expect(() => {
        container.resolveRequired(token, 'Custom error message');
      }).toThrow('Custom error message');
    });
  });

  describe('isRegistered', () => {
    it('should return false for unregistered token', () => {
      const token = createToken<string>('UnregisteredService');

      expect(container.isRegistered(token)).toBe(false);
    });

    it('should return true for registered token', () => {
      const token = createToken<string>('TestService');
      container.registerSingleton(token, 'value');

      expect(container.isRegistered(token)).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all registrations', () => {
      const token1 = createToken<string>('Service1');
      const token2 = createToken<string>('Service2');

      container.registerSingleton(token1, 'instance1');
      container.registerSingleton(token2, 'instance2');

      expect(container.resolve(token1)).toBe('instance1');
      expect(container.resolve(token2)).toBe('instance2');

      container.clear();

      expect(container.resolve(token1)).toBeUndefined();
      expect(container.resolve(token2)).toBeUndefined();
    });
  });

  describe('resolveOr', () => {
    it('should resolve token if registered', () => {
      const token = createToken<string>('TestService');
      container.registerSingleton(token, 'registered-value');
      const fallback = jest.fn(() => 'fallback-value');

      const result = resolveOr(token, fallback);

      expect(result).toBe('registered-value');
      expect(fallback).not.toHaveBeenCalled();
    });

    it('should use fallback if token not registered', () => {
      const token = createToken<string>('UnregisteredService');
      const fallback = jest.fn(() => 'fallback-value');

      const result = resolveOr(token, fallback);

      expect(result).toBe('fallback-value');
      expect(fallback).toHaveBeenCalledTimes(1);
    });

    it('should call fallback factory on each call if not registered', () => {
      const token = createToken<{ id: number }>('UnregisteredService');
      let counter = 0;
      const fallback = jest.fn(() => ({ id: ++counter }));

      const result1 = resolveOr(token, fallback);
      const result2 = resolveOr(token, fallback);

      expect(fallback).toHaveBeenCalledTimes(2);
      expect(result1.id).toBe(1);
      expect(result2.id).toBe(2);
      expect(result1).not.toBe(result2);
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple tokens', () => {
      const token1 = createToken<string>('Service1');
      const token2 = createToken<number>('Service2');
      const token3 = createToken<boolean>('Service3');

      container.registerSingleton(token1, 'value1');
      container.registerFactory(token2, () => 42);
      container.registerSingleton(token3, true);

      expect(container.resolve(token1)).toBe('value1');
      expect(container.resolve(token2)).toBe(42);
      expect(container.resolve(token3)).toBe(true);
    });

    it('should handle nested dependencies through factories', () => {
      interface IDependency {
        value: string;
      }

      interface IService {
        dependency: IDependency;
      }

      const depToken = createToken<IDependency>('Dependency');
      const serviceToken = createToken<IService>('Service');

      container.registerFactory(depToken, () => ({ value: 'dep-value' }));
      container.registerFactory(serviceToken, () => ({
        dependency: container.resolve(depToken)!,
      }));

      const service = container.resolve(serviceToken);

      expect(service?.dependency.value).toBe('dep-value');
    });
  });
});
