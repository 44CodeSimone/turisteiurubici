// Helpers de URLs externas para mapas e WhatsApp.

export function googleMapsUrl(lat: number, lng: number, _label?: string) {
  // Abre rota direta no Google Maps a partir da localização do usuário.
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

export function googleMapsViewUrl(lat: number, lng: number) {
  // Apenas visualizar o ponto (sem rota).
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function wazeUrl(lat: number, lng: number) {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

export function whatsappUrl(phone: string, msg = "Olá! Vim pelo Turistei Urubici.") {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}
