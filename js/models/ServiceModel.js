export const ServiceModel = {
    getAll() {
        return [
            {
                id: 1,
                name: 'Ensamblaje de PC Personalizado',
                description: 'Montaje profesional con gestión de cables, optimización térmica y pruebas de estrés completas.',
                price: 149,
                badge: 'POPULAR',
                category: 'Ensamblaje'
            },
            {
                id: 2,
                name: 'Overclocking Extremo',
                description: 'Configuración experta de CPU y GPU con pruebas de estabilidad y perfiles personalizados.',
                price: 89,
                badge: 'AVANZADO',
                category: 'Overclocking'
            },
            {
                id: 3,
                name: 'Refrigeración Líquida Custom',
                description: 'Instalación de loops AIO o custom con tuberías rígidas y control de temperatura.',
                price: 199,
                badge: 'PREMIUM',
                category: 'Refrigeración'
            },
            {
                id: 4,
                name: 'Diagnóstico de Hardware',
                description: 'Análisis completo de componentes, detección de fallos y reporte técnico detallado.',
                price: 49,
                badge: 'ESENCIAL',
                category: 'Diagnóstico'
            }
        ];
    },

    getByCategory(category) {
        if (!category) return this.getAll();
        return this.getAll().filter(s => s.category === category);
    }
};
