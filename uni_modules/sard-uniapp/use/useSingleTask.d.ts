export declare function useSingleTask(): {
    isWorking: Readonly<import("vue").Ref<boolean, boolean>>;
    startTask: (task: () => any) => Promise<void>;
    onFinishTask: (handler: () => any) => void;
    offFinishTask: (handler: () => any) => void;
};
