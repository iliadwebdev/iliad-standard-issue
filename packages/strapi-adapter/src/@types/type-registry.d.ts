namespace IliadStrapiAdapter {
  interface paths {
    [
      key: keyof IliadStrapiAdapter.paths extends undefined
        ? string
        : keyof IliadStrapiAdapter.paths
    ]: Record<
      | "get"
      | "put"
      | "post"
      | "delete"
      | "options"
      | "head"
      | "patch"
      | "trace",
      {}
    >;
  }
  interface components {
    [key: string]: Record<string | number, any>;
  }

  interface operations {
    [key: string]: Record<string | number, any>;
  }
}
