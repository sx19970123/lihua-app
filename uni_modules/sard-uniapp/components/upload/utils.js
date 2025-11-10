import { toArray } from '../../utils';
export function chooseMedia(options) {
    const { count = 9, mediaType = 'image', sourceType = ['album', 'camera'], maxDuration = 10, sizeType = ['original', 'compressed'], camera = 'back', success, fail, complete, } = options;
    const arrayMediaType = toArray(mediaType);
    const hasImage = arrayMediaType.includes('image');
    const hasVideo = arrayMediaType.includes('video');
    if (hasImage && hasVideo && uni.chooseMedia) {
        return uni.chooseMedia({
            count,
            mediaType: ['image', 'video'],
            sourceType,
            maxDuration,
            sizeType,
            camera,
            success(res) {
                success?.({
                    type: res.type,
                    tempFiles: toArray(res.tempFiles).map((file) => {
                        return {
                            tempFilePath: file.tempFilePath,
                            size: file.size,
                            duration: file.duration,
                            height: file.height,
                            width: file.width,
                            name: '',
                            fileType: file.fileType,
                        };
                    }),
                });
            },
            fail,
            complete,
        });
    }
    else if (hasImage) {
        return uni.chooseImage({
            count,
            sizeType,
            sourceType,
            success(res) {
                success?.({
                    type: 'image',
                    tempFiles: toArray(res.tempFiles).map((file) => {
                        return {
                            tempFilePath: file.path,
                            size: file.size,
                            duration: 0,
                            height: 0,
                            width: 0,
                            name: file.name || '',
                            fileType: 'image',
                        };
                    }),
                });
            },
            fail,
            complete,
        });
    }
    else if (hasVideo) {
        return uni.chooseVideo({
            sourceType,
            compressed: sizeType.includes('compressed'),
            maxDuration,
            camera,
            success(res) {
                success?.({
                    type: 'video',
                    tempFiles: [
                        {
                            tempFilePath: res.tempFilePath,
                            size: res.size,
                            duration: res.duration,
                            height: res.height,
                            width: res.width,
                            name: res.name || '',
                            fileType: 'video',
                        },
                    ],
                });
            },
            fail,
            complete,
        });
    }
}
