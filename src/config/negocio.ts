export const NEGOCIO = {
  nombre: 'ValpoTrips',
  razonSocial: 'ValpoTrips EIRL',
  eslogan: 'Traslados privados con la seguridad y el trato de siempre',
  conductor: 'Juan Henríquez',
  apodo: 'El Profe',
  telefono: '+56 9 9348 2243',
  whatsapp: '56993482243',
  email: 'contacto@valpotrips.cl',
  instagram: 'https://www.instagram.com/valpo.trips/',
  instagramHandle: '@valpo.trips',
  zona: 'Valparaíso, Viña del Mar y toda la Región',
  capacidadPax: 6,
};

export const whatsappUrl = (texto: string) =>
  `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`;