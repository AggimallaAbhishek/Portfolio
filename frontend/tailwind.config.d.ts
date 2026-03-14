import typography from "@tailwindcss/typography";
declare const _default: {
    content: string[];
    darkMode: "class";
    theme: {
        extend: {
            fontFamily: {
                display: [string, string];
                body: [string, string];
            };
            colors: {
                night: string;
                mist: string;
                cyan: string;
                coral: string;
                purple: string;
                sand: string;
            };
            boxShadow: {
                glow: string;
                "glass-inset": string;
            };
            backgroundImage: {
                "hero-mesh": string;
            };
            keyframes: {
                float: {
                    "0%, 100%": {
                        transform: string;
                    };
                    "50%": {
                        transform: string;
                    };
                };
                "aurora-1": {
                    "0%, 100%": {
                        top: string;
                        right: string;
                        transform: string;
                    };
                    "50%": {
                        top: string;
                        right: string;
                        transform: string;
                    };
                };
                "aurora-2": {
                    "0%, 100%": {
                        bottom: string;
                        left: string;
                        transform: string;
                    };
                    "50%": {
                        bottom: string;
                        left: string;
                        transform: string;
                    };
                };
                "aurora-3": {
                    "0%, 100%": {
                        top: string;
                        left: string;
                        transform: string;
                    };
                    "50%": {
                        top: string;
                        left: string;
                        transform: string;
                    };
                };
            };
            animation: {
                float: string;
                "aurora-1": string;
                "aurora-2": string;
                "aurora-3": string;
            };
        };
    };
    plugins: (typeof typography)[];
};
export default _default;
