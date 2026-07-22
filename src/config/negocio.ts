export const NEGOCIO = {
  nombre: 'Traslados Valparaíso',
  eslogan: 'Traslados privados, puntuales y seguros',
  telefono: '+56 9 1234 5678',
  whatsapp: '56912345678', // solo dígitos, con código país
  email: 'contacto@tudominio.cl',
  instagram: 'https://www.instagram.com/tucuenta',
  zona: 'Valparaíso, Viña del Mar y Región de Valparaíso',
};

export const whatsappUrl = (texto: string) =>
  `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`;