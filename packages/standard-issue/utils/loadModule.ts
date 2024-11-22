class ImportError extends Error {}

const loadModule = async (modulePath) => {
  try {
    return await import(modulePath);
  } catch (e) {
    throw new ImportError(`Unable to import module ${modulePath}`);
  }
};

export { loadModule };
