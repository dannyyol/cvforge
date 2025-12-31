declare module 'react-quill' {
    import React from 'react';
    
    export interface ReactQuillProps {
        theme?: string;
        modules?: any;
        formats?: string[];
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        readOnly?: boolean;
        onChange?: (content: string, delta: any, source: string, editor: any) => void;
        onChangeSelection?: (range: any, source: string, editor: any) => void;
        onFocus?: (range: any, source: string, editor: any) => void;
        onBlur?: (previousRange: any, source: string, editor: any) => void;
        onKeyPress?: React.EventHandler<any>;
        onKeyDown?: React.EventHandler<any>;
        onKeyUp?: React.EventHandler<any>;
        className?: string;
        style?: React.CSSProperties;
        preserveWhitespace?: boolean;
        tabIndex?: number;
        bounds?: string | HTMLElement;
        scrollingContainer?: string | HTMLElement;
        children?: React.ReactNode;
    }

    class ReactQuill extends React.Component<ReactQuillProps> {
        focus(): void;
        blur(): void;
        getEditor(): any;
    }

    export default ReactQuill;
}
