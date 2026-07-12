// Paleta de colores global del diseño definitivo de BETA.
// Se centraliza aquí para no repetir los hex en cada componente
// y para poder ajustar la identidad visual desde un solo lugar.
//
// Los tokens *Soft / *Deep son variantes derivadas de la paleta base,
// pensadas para gradientes, vidrio (glass) y sombras en capas del
// nuevo Dashboard — la paleta base no cambia, solo se le da más rango.

export const C = {
  cream: "#FFFACB",
  creamDeep: "#FFF3A8",
  creamSoft: "#FFFDF0",
  navy: "#12263A",
  navySoft: "#3F6178",
  navyDeep: "#0B1826",
  blue: "#405FFA",
  blueSoft: "#DCEBFB",
  blueDeep: "#2A3FCC",
  turquoise: "#26CBD1",
  turquoiseSoft: "#DDF6F7",
  moss: "#84D175",
  mossSoft: "#E4F7E1",
  mossDeep: "#5FA463",
  mandarin: "#F8910C",
  mandarinSoft: "#FDECDD",
  sun: "#FABE0B",
  sunSoft: "#FFF3C4",
  sunDeep: "#E29A00",
  slate: "#668EA5",
  white: "#FFFFFF",
} as const;