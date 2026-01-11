/**
 * DI Container для управления зависимостями
 * Реализация паттерна Dependency Injection
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Token<T = unknown> = symbol | string;

type Factory<T> = () => T;

interface ContainerEntry<T> {
  factory?: Factory<T>;
  singleton?: T;
  isSingleton: boolean;
}

class DIContainer {
  private entries = new Map<Token, ContainerEntry<unknown>>();

  /**
   * Создать токен для типа
   */
  createToken<T = unknown>(name: string): Token<T> {
    return Symbol(name);
  }

  /**
   * Зарегистрировать фабрику (создаёт новый экземпляр при каждом resolve)
   */
  registerFactory<T>(token: Token<T>, factory: Factory<T>): void {
    this.entries.set(token, {
      factory,
      isSingleton: false,
    });
  }

  /**
   * Зарегистрировать синглтон (один экземпляр на всё приложение)
   */
  registerSingleton<T>(token: Token<T>, instance: T): void {
    this.entries.set(token, {
      singleton: instance,
      isSingleton: true,
    });
  }

  /**
   * Получить зависимость (может вернуть undefined)
   */
  resolve<T>(token: Token<T>): T | undefined {
    const entry = this.entries.get(token);

    if (!entry) {
      return undefined;
    }

    if (entry.isSingleton) {
      return entry.singleton as T;
    }

    if (entry.factory) {
      return entry.factory() as T;
    }

    return undefined;
  }

  /**
   * Получить зависимость или выбросить ошибку
   */
  resolveRequired<T>(token: Token<T>, message?: string): T {
    const instance = this.resolve<T>(token);

    if (instance === undefined) {
      throw new Error(
        message || `Dependency with token ${String(token)} not found`
      );
    }

    return instance;
  }

  /**
   * Проверить, зарегистрирована ли зависимость
   */
  isRegistered(token: Token): boolean {
    return this.entries.has(token);
  }

  /**
   * Очистить все регистрации (для тестов)
   */
  clear(): void {
    this.entries.clear();
  }
}

// Глобальный экземпляр контейнера
const container = new DIContainer();

/**
 * Получить зависимость или создать через fallback
 */
export function resolveOr<T>(
  token: Token<T>,
  fallbackFactory: Factory<T>
): T {
  const instance = container.resolve<T>(token);
  return instance !== undefined ? instance : fallbackFactory();
}

/**
 * Получить зависимость или выбросить ошибку
 */
export function resolveRequired<T>(token: Token<T>, message?: string): T {
  return container.resolveRequired<T>(token, message);
}

/**
 * Создать токен для типа
 */
export function createToken<T = unknown>(name: string): Token<T> {
  return container.createToken<T>(name);
}

export { container, type Token, type Factory };
export default container;
