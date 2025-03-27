export interface FileAPI {
    uploadFile: (file: File) => Promise<any>;
    deleteFile: (fileId: string) => Promise<any>;
}
