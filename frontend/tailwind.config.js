import typography from "@tailwindcss/typography";
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                display: ["'Space Grotesk'", "sans-serif"],
                body: ["'IBM Plex Sans'", "sans-serif"]
            },
            colors: {
                night: "#030712",
                mist: "#e6edf6",
                cyan: "#2dd4bf",
                coral: "#fb7185",
                purple: "#a855f7",
                sand: "#f6efe8"
            },
            boxShadow: {
                glow: "0 0 40px -10px rgba(45, 212, 191, 0.2)",
                "glass-inset": "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
            },
            backgroundImage: {
                "hero-mesh": "radial-gradient(circle at top left, rgba(45, 212, 191, 0.15), transparent 40%), radial-gradient(circle at top right, rgba(251, 113, 133, 0.15), transparent 40%), linear-gradient(135deg, rgba(3, 7, 18, 0.9), rgba(15, 23, 42, 0.9))"
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" }
                },
                "aurora-1": {
                    "0%, 100%": { top: "-10%", right: "-5%", transform: "scale(1)" },
                    "50%": { top: "5%", right: "15%", transform: "scale(1.2)" }
                },
                "aurora-2": {
                    "0%, 100%": { bottom: "-10%", left: "-10%", transform: "scale(1)" },
                    "50%": { bottom: "20%", left: "10%", transform: "scale(1.3)" }
                },
                "aurora-3": {
                    "0%, 100%": { top: "40%", left: "50%", transform: "scale(1) translate(-50%, -50%)" },
                    "50%": { top: "30%", left: "60%", transform: "scale(1.1) translate(-50%, -50%)" }
                }
            },
            animation: {
                float: "float 6s ease-in-out infinite",
                "aurora-1": "aurora-1 15s ease-in-out infinite alternate",
                "aurora-2": "aurora-2 18s ease-in-out infinite alternate",
                "aurora-3": "aurora-3 20s ease-in-out infinite alternate"
            }
        }
    },
    plugins: [typography]
};
