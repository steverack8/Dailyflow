# React + Vite

Template ini menyediakan pengaturan minimal untuk menjalankan React di Vite dengan HMR dan beberapa aturan ESLint.

Saat ini tersedia dua plugin resmi:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) menggunakan [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) menggunakan [SWC](https://swc.rs/)

## React Compiler

React Compiler tidak diaktifkan pada template ini karena berdampak pada performa dev dan build. Untuk menambahkannya, lihat [dokumentasi ini](https://react.dev/learn/react-compiler/installation).

## Mengembangkan konfigurasi ESLint

Jika kamu mengembangkan aplikasi produksi, kami sarankan menggunakan TypeScript dengan aturan lint bertipe aktif. Lihat [template TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) untuk informasi cara mengintegrasikan TypeScript dan [`typescript-eslint`](https://typescript-eslint.io) di proyekmu.
