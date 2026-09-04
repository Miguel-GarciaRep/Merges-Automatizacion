import { Storage } from '../utils/storage.js';

const STORAGE_KEY = 'coreshop_products';

const DEFAULT_PRODUCTS = [
    { id: 1, name: 'Intel Core i9-14900K', brand: 'Intel', price: 589, stock: 15, description: '24 núcleos (8P+16E) / 32 hilos. Ideal para estaciones de trabajo.', category: 'Procesadores' },
    { id: 2, name: 'GeForce RTX 4090 FE', brand: 'NVIDIA', price: 1599, stock: 8, description: '24GB GDDR6X / 16384 núcleos CUDA. Máximo rendimiento gráfico.', category: 'Tarjetas Gráficas' },
    { id: 3, name: 'AMD Ryzen 9 7950X', brand: 'AMD', price: 549, stock: 22, description: '16 núcleos / 32 hilos con arquitectura Zen 4.', category: 'Procesadores' },
    { id: 4, name: 'Corsair Vengeance 32GB DDR5', brand: 'Corsair', price: 129, stock: 45, description: 'Kit 2x16GB DDR5-6000 CL30. Baja latencia.', category: 'Memoria' },
    { id: 5, name: 'Samsung 990 Pro 2TB', brand: 'Samsung', price: 179, stock: 30, description: 'NVMe PCIe 4.0. Lectura secuencial hasta 7450 MB/s.', category: 'Almacenamiento' },
    { id: 6, name: 'ASUS ROG Strix B650-E', brand: 'ASUS', price: 289, stock: 18, description: 'Placa base AM5 con WiFi 6E y PCIe 5.0.', category: 'Placas Base' },
    { id: 7, name: 'Radeon RX 7900 XTX', brand: 'AMD', price: 999, stock: 12, description: '24GB GDDR6. Excelente para render y gaming 4K.', category: 'Tarjetas Gráficas' },
    { id: 8, name: 'Kingston Fury 64GB DDR5', brand: 'Kingston', price: 219, stock: 20, description: 'Kit 2x32GB DDR5-5600 para cargas profesionales.', category: 'Memoria' }
];

export const ProductModel = {
    getAll() {
        const stored = Storage.get(STORAGE_KEY);
        if (!stored) {
            Storage.set(STORAGE_KEY, DEFAULT_PRODUCTS);
            return [...DEFAULT_PRODUCTS];
        }
        return stored;
    },

    getById(id) {
        return this.getAll().find(p => p.id === id);
    },

    filter({ name = '', brand = '', minPrice = '', maxPrice = '', category = '' }) {
        return this.getAll().filter(product => {
            const matchName = !name || product.name.toLowerCase().includes(name.toLowerCase());
            const matchBrand = !brand || product.brand.toLowerCase().includes(brand.toLowerCase());
            const matchMin = minPrice === '' || product.price >= Number(minPrice);
            const matchMax = maxPrice === '' || product.price <= Number(maxPrice);
            const matchCategory = !category || product.category === category;
            return matchName && matchBrand && matchMin && matchMax && matchCategory;
        });
    },

    getCategories() {
        return [...new Set(this.getAll().map(p => p.category))];
    }
};
