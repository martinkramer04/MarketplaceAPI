const mockProveedores = [
    {
        id: 1,
        nombre: 'La Bodega Club',
        rubro: 'Gastronomía',
        cajas: 15,
        estado: 'active',
        ciudad: 'Mendoza',
        ownerName: 'Carlos Mendez',
        email: 'carlos@labodegaclub.com',
        phone: '+54 261 000-0000',
        website: 'www.labodegaclub.com',
        address: 'Av. San Martín 1234',
        description: 'Bodega boutique especializada en experiencias de maridaje y catas premium con los mejores vinos de Cuyo.',
        cajasPublicadas: [
            { id: 1, name: 'Clase Magistral de Maridaje de Vinos', price: 120, activations: 342, status: 'published' },
            { id: 2, name: 'Cata Privada de Malbec', price: 95, activations: 210, status: 'published' },
        ]
    },
    {
        id: 2,
        nombre: 'Zen Escapes',
        rubro: 'Bienestar',
        cajas: 12,
        estado: 'active',
        ciudad: 'Bariloche',
        ownerName: 'Valentina Torres',
        email: 'vale@zenescapes.com',
        phone: '+54 294 000-0000',
        website: 'www.zenescapes.com',
        address: 'Ruta 40 km 1200',
        description: 'Retiros de bienestar y mindfulness en la Patagonia. Experiencias únicas en contacto con la naturaleza.',
        cajasPublicadas: [
            { id: 3, name: 'Retiro de Mindfulness en la Montaña', price: 210, activations: 189, status: 'published' },
            { id: 4, name: 'Fin de Semana de Yoga y Spa', price: 175, activations: 97, status: 'published' },
        ]
    },
    {
        id: 3,
        nombre: 'Artisan Collective',
        rubro: 'Gastronomía',
        cajas: 8,
        estado: 'active',
        ciudad: 'Buenos Aires',
        ownerName: 'Martín Russo',
        email: 'martin@artisancollective.com',
        phone: '+54 11 0000-0000',
        website: 'www.artisancollective.com',
        address: 'Thames 1800, Palermo',
        description: 'Colectivo de chefs y artesanos gastronómicos. Clases de cocina, catas y experiencias culinarias urbanas.',
        cajasPublicadas: [
            { id: 5, name: 'Clase de Cocina Urbana', price: 89, activations: 412, status: 'published' },
        ]
    },
    {
        id: 4,
        nombre: 'AdventureX',
        rubro: 'Aventura',
        cajas: 3,
        estado: 'active',
        ciudad: 'Córdoba',
        ownerName: 'Diego Almada',
        email: 'diego@adventurex.com',
        phone: '+54 351 000-0000',
        website: 'www.adventurex.com',
        address: 'Av. Colón 500',
        description: 'Empresa líder en deportes extremos y aventura en las sierras cordobesas.',
        cajasPublicadas: [
            { id: 6, name: 'Fin de Semana de Karting Extremo', price: 180, activations: 54, status: 'published' },
        ]
    },
    {
        id: 5,
        nombre: 'Coastal Crafts',
        rubro: 'Bienestar',
        cajas: 0,
        estado: 'pending',
        ciudad: 'Mar del Plata',
        ownerName: 'Ana Benitez',
        email: 'ana@coastalcrafts.com',
        phone: '+54 223 000-0000',
        website: '',
        address: 'Av. Constitución 3200',
        description: 'Taller de surf, cerámica y retiros creativos frente al mar.',
        cajasPublicadas: []
    },
]
export default mockProveedores