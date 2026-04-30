export function googleMapsUrl(lat: number, lng: number, label?: string) {
  const q = label ? `${encodeURIComponent(label)}@${lat},${lng}` : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(label ?? "")}`;
}

export function wazeUrl(lat: number, lng: number) {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

export function whatsappUrl(phone: string, msg = "Olá! Vim pelo Turistei Urubici.") {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}
