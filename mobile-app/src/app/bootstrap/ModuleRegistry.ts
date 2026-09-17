export interface AppModule {
  name: string;
  version: string;
  init: () => Promise<void> | void;
}

class ModuleRegistry {
  private modules: Map<string, AppModule> = new Map();

  register(module: AppModule): void {
    if (this.modules.has(module.name)) {
      console.warn(`Module "${module.name}" is already registered.`);
      return;
    }
    this.modules.set(module.name, module);
  }

  get(name: string): AppModule | undefined {
    return this.modules.get(name);
  }

  getAll(): AppModule[] {
    return Array.from(this.modules.values());
  }

  async initializeAll(): Promise<void> {
    await Promise.all(
      Array.from(this.modules.values()).map(async (module) => {
        try {
          await module.init();
        } catch (error) {
          console.error(`Failed to initialize module "${module.name}":`, error);
        }
      })
    );
  }
}

export const moduleRegistry = new ModuleRegistry();
export default moduleRegistry;
