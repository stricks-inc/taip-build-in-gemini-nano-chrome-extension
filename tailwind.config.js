module.exports = {
    prefix: 'taip-',
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    important: ['.taip-extension-root'],
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            fontFamily: {
                quicksand: ['Quicksand', 'sans-serif'],
            },
        },
    },
    plugins: [],
}