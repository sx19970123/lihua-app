interface chooseMediaOptions {
    count?: number;
    mediaType?: 'image' | 'video' | ('image' | 'video')[];
    sourceType?: ('album' | 'camera')[];
    maxDuration?: number;
    sizeType?: ('original' | 'compressed')[];
    camera?: 'back' | 'front';
    success?: (result: chooseMediaResult) => void;
    fail?: (err: any) => void;
    complete?: () => void;
}
interface chooseMediaResult {
    tempFiles: {
        tempFilePath: string;
        size: number;
        duration: number;
        height: number;
        width: number;
        fileType: 'image' | 'video';
        name: string;
    }[];
    type: 'image' | 'video' | 'mix';
}
export declare function chooseMedia(options: chooseMediaOptions): void;
export {};
