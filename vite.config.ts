// vite.config.ts
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
    plugins: [
        dts({
            include: ["src"],
            rollupTypes: true,
        }),
    ],
    resolve: {
        alias: [
            {
                find: "~",
                replacement: path.resolve(__dirname, "./src"),
            },
        ],
    },
    server: {
        port: 3000,
    },
    build: {
        minify: true,
        reportCompressedSize: true,
        lib: {
            entry: path.resolve(__dirname, 'src/main.ts'),
            name: 'polygon-intersection',
            fileName: 'main',
        },
        rolldownOptions: {
            external: [],
        },
    },
})