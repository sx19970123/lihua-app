import { type FieldName, type FormProps } from './common';
export declare function useForm(props: FormProps): {
    expose: {
        validate: (nameList?: FieldName[]) => Promise<void>;
        reset: (nameList?: FieldName[]) => Promise<void>;
        clearValidate: (nameList?: FieldName[]) => Promise<void>;
        scrollToField: (name: FieldName) => void;
    };
};
