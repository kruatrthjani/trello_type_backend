declare module 'graphql-upload' {
  export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream(): NodeJS.ReadableStream;
  }

  export const GraphQLUpload: any;
  export const graphqlUploadExpress: (options?: {
    maxFileSize?: number;
    maxFiles?: number;
  }) => any;
}

declare module 'graphql-upload/GraphQLUpload.mjs' {
  const GraphQLUpload: any;
  export default GraphQLUpload;
}

declare module 'graphql-upload/graphqlUploadExpress.mjs' {
  const graphqlUploadExpress: (options?: {
    maxFileSize?: number;
    maxFiles?: number;
  }) => any;
  export default graphqlUploadExpress;
}
