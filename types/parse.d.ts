declare module "parse/dist/parse.min.js" {
  const Parse: {
    initialize: (appId: string, key: string) => void;
    serverURL: string;
    Query: new (className: string) => {
      descending: (key: string) => void;
      limit: (n: number) => void;
      find: () => Promise<{ id: string; get: (key: string) => unknown }[]>;
    };
  };
  export default Parse;
}
