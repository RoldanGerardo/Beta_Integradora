import {
  Wallet, Zap, Sparkles, ShieldCheck, Wrench, PiggyBank,
  Brain, Target, GraduationCap, type LucideIcon,
} from "lucide-react";

// ════════════════════════════════════════════════════════════
// Datos y motor de los Cuestionarios reflexivos de BETA.
// Cada cuestionario tiene preguntas con opciones ponderadas.
// La suma de puntos ubica al usuario en un nivel de resultado
// con perfil, fortalezas, áreas de mejora y recomendaciones.
// ════════════════════════════════════════════════════════════

export interface OpcionPregunta {
  texto: string;
  puntos: number;
}

export interface PreguntaCuestionario {
  id: string;
  texto: string;
  opciones: OpcionPregunta[];
}

export interface NivelResultado {
  min: number;
  max: number;
  perfil: string;
  emoji: string;
  descripcion: string;
  fortalezas: string[];
  areasMejora: string[];
  recomendaciones: string[];
  habitosSugeridos: string[];
  proximosPasos: string[];
  recursos: string[];
}

export interface Cuestionario {
  id: string;
  titulo: string;
  descripcionCorta: string;
  categoria: string;
  Icon: LucideIcon;
  color: string;
  bg: string;
  minutos: number;
  preguntas: PreguntaCuestionario[];
  niveles: NivelResultado[];
}

const LLAVE_PROGRESO = "beta_cuestionarios_progreso";

export interface ProgresoGuardado {
  puntaje: number;
  puntajeMax: number;
  fecha: string;
}

export function cargarProgreso(): Record<string, ProgresoGuardado> {
  try {
    const raw = localStorage.getItem(LLAVE_PROGRESO);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function guardarProgreso(id: string, resultado: ProgresoGuardado) {
  try {
    const actual = cargarProgreso();
    actual[id] = resultado;
    localStorage.setItem(LLAVE_PROGRESO, JSON.stringify(actual));
  } catch {
    /* noop */
  }
}

export function obtenerNivel(cuestionario: Cuestionario, puntaje: number): NivelResultado {
  const nivel = cuestionario.niveles.find((n) => puntaje >= n.min && puntaje <= n.max);
  return nivel ?? cuestionario.niveles[cuestionario.niveles.length - 1];
}

export function puntajeMaximo(cuestionario: Cuestionario): number {
  return cuestionario.preguntas.reduce(
    (acc, p) => acc + Math.max(...p.opciones.map((o) => o.puntos)),
    0
  );
}

// ────────────────────────────────────────────────────────────
// 1. ¿Cómo administras tu dinero?
// ────────────────────────────────────────────────────────────
const administracion: Cuestionario = {
  id: "administracion",
  titulo: "¿Cómo administras tu dinero?",
  descripcionCorta: "Descubre tu estilo de organización financiera del día a día.",
  categoria: "Organización",
  Icon: Wallet,
  color: "#405FFA",
  bg: "#DCEBFB",
  minutos: 3,
  preguntas: [
    { id: "a1", texto: "Cuando te llega dinero (beca, sueldo, mesada), ¿qué haces primero?", opciones: [
      { texto: "Lo gasto en lo que se me antoje ese día", puntos: 1 },
      { texto: "Pago lo urgente y el resto queda suelto", puntos: 2 },
      { texto: "Separo algo para gastos fijos y me quedo con el resto libre", puntos: 3 },
      { texto: "Lo distribuyo en categorías antes de gastar un peso", puntos: 4 },
    ]},
    { id: "a2", texto: "¿Sabes cuánto gastaste el mes pasado?", opciones: [
      { texto: "No tengo idea", puntos: 1 },
      { texto: "Más o menos, por recuerdo", puntos: 2 },
      { texto: "Tengo una idea bastante cercana", puntos: 3 },
      { texto: "Sí, lo tengo registrado", puntos: 4 },
    ]},
    { id: "a3", texto: "¿Usas alguna herramienta para llevar tus finanzas?", opciones: [
      { texto: "Ninguna", puntos: 1 },
      { texto: "A veces anoto algo en el celular", puntos: 2 },
      { texto: "Uso una app o Excel de vez en cuando", puntos: 3 },
      { texto: "Registro mis movimientos de forma constante", puntos: 4 },
    ]},
    { id: "a4", texto: "Cuando terminas la quincena o el mes, ¿qué sueles sentir?", opciones: [
      { texto: "Sorpresa de que ya no tengo nada", puntos: 1 },
      { texto: "Alivio de que alcanzó, aunque no sé bien cómo", puntos: 2 },
      { texto: "Tranquilidad, casi siempre cuadra", puntos: 3 },
      { texto: "Control total, sé exactamente en qué se fue", puntos: 4 },
    ]},
    { id: "a5", texto: "¿Separas tu dinero por categorías (comida, transporte, diversión)?", opciones: [
      { texto: "No, todo va del mismo lugar", puntos: 1 },
      { texto: "Solo para lo más importante", puntos: 2 },
      { texto: "Para varias categorías, aunque no todas", puntos: 3 },
      { texto: "Sí, tengo un sistema claro por categoría", puntos: 4 },
    ]},
    { id: "a6", texto: "Si tuvieras que explicarle a alguien tu método para administrar tu dinero, ¿qué dirías?", opciones: [
      { texto: "No tengo un método", puntos: 1 },
      { texto: "Voy resolviendo sobre la marcha", puntos: 2 },
      { texto: "Tengo reglas básicas que sigo casi siempre", puntos: 3 },
      { texto: "Tengo un sistema claro y lo sigo con disciplina", puntos: 4 },
    ]},
  ],
  niveles: [
    { min: 0, max: 10, perfil: "Explorador en construcción", emoji: "🧭",
      descripcion: "Todavía no tienes un sistema para organizar tu dinero, y eso es completamente normal al empezar. Cada peso se gasta según el momento, sin un plan detrás.",
      fortalezas: ["Eres flexible y te adaptas rápido a lo que necesitas en el momento", "No te complicas la vida con reglas rígidas", "Tienes la disposición de aprender, ya que estás aquí reflexionando sobre esto"],
      areasMejora: ["No hay registro de en qué se va el dinero", "No existen categorías ni límites de gasto", "Las sorpresas de fin de quincena son frecuentes"],
      recomendaciones: ["Empieza por anotar cada gasto durante una semana, sin juzgarte, solo para ver el panorama real", "Elige una sola categoría para empezar a organizar, por ejemplo comida o transporte", "Usa el módulo de Movimientos de BETA para registrar tus primeros ingresos y egresos"],
      habitosSugeridos: ["Anotar gastos apenas ocurren, no al final del día", "Revisar el saldo disponible antes de una compra grande", "Fijar un día fijo a la semana para revisar cómo va el dinero"],
      proximosPasos: ["Registra tus movimientos de esta semana en BETA", "Repite este cuestionario en un mes para ver tu avance"],
      recursos: ["Artículo: primeros pasos para organizar tus finanzas", "Cuestionario: ¿qué tipo de ahorrador eres?"] },
    { min: 11, max: 18, perfil: "Organizador en progreso", emoji: "🌱",
      descripcion: "Ya tienes algunas costumbres que te ayudan a mantener cierto orden, aunque todavía no es un sistema completo. Vas por buen camino.",
      fortalezas: ["Tienes noción de tus gastos fijos", "Reaccionas a tiempo ante lo urgente", "Ya diste el primer paso hacia organizarte mejor"],
      areasMejora: ["El registro de gastos es irregular", "Las categorías de gasto no están del todo definidas", "Falta consistencia semana a semana"],
      recomendaciones: ["Define 4 o 5 categorías simples y úsalas siempre, aunque sea de forma aproximada", "Prueba un registro semanal en vez de diario si el diario se siente pesado", "Revisa tus movimientos en BETA cada domingo para cerrar la semana"],
      habitosSugeridos: ["Registrar gastos al menos 3 veces por semana", "Comparar lo planeado contra lo real cada quincena", "Guardar los tickets o capturas de pantalla de compras grandes"],
      proximosPasos: ["Activa un recordatorio semanal para revisar tus movimientos", "Prueba el cuestionario de hábitos financieros para afinar detalles"],
      recursos: ["Artículo: cómo crear categorías de gasto que sí uses", "Reportes quincenales de BETA"] },
    { min: 19, max: 24, perfil: "Administrador consciente", emoji: "📊",
      descripcion: "Tienes un sistema que funciona: sabes más o menos en qué se va tu dinero y tomas decisiones con cierta base. Con pequeños ajustes puedes llevarlo al siguiente nivel.",
      fortalezas: ["Tienes categorías claras de gasto", "Sabes calcular a grandes rasgos cuánto gastaste", "Rara vez te sorprende el fin de mes"],
      areasMejora: ["El registro no siempre es inmediato", "Podrías automatizar más el seguimiento", "Aún hay margen para anticipar mejor los gastos variables"],
      recomendaciones: ["Usa los Reportes de BETA para comparar meses y detectar patrones", "Define un presupuesto por categoría, no solo un registro posterior", "Revisa qué categoría se sale de control con más frecuencia"],
      habitosSugeridos: ["Registrar movimientos el mismo día que ocurren", "Revisar reportes mensuales, no solo quincenales", "Ajustar el presupuesto del mes siguiente según lo aprendido"],
      proximosPasos: ["Compara tu último reporte quincenal con el mensual", "Haz el cuestionario de metas financieras para ponerle dirección a tu orden"],
      recursos: ["Artículo: de registrar a presupuestar", "Reportes mensuales de BETA"] },
    { min: 25, max: 24, perfil: "Maestro del orden financiero", emoji: "🏆",
      descripcion: "Tienes un sistema sólido y consistente. Registras, categorizas y revisas tu dinero con disciplina real. Esto te da una base excelente para metas más ambiciosas.",
      fortalezas: ["Registro constante y confiable de tus movimientos", "Categorías bien definidas y respetadas", "Control total sobre a dónde va tu dinero"],
      areasMejora: ["Podrías enfocar tu disciplina en el ahorro a largo plazo", "Vale la pena explorar metas financieras más grandes", "Comparte tu método, podría ayudar a otros"],
      recomendaciones: ["Fija metas de ahorro concretas ahora que tienes el control del día a día", "Explora el cuestionario de personalidad financiera para afinar tu estrategia", "Considera automatizar transferencias a una categoría de ahorro"],
      habitosSugeridos: ["Revisar tendencias mensuales, no solo montos", "Ajustar metas cada trimestre", "Compartir o enseñar tu sistema a alguien más"],
      proximosPasos: ["Define una meta de ahorro específica para los próximos 3 meses", "Haz el cuestionario de metas financieras"],
      recursos: ["Artículo: de organizar a hacer crecer tu dinero", "Cuestionario: ¿qué tan cerca estás de tus metas financieras?"] },
  ],
};

// ────────────────────────────────────────────────────────────
// 2. ¿Qué tan impulsivas son tus compras?
// ────────────────────────────────────────────────────────────
const impulsividad: Cuestionario = {
  id: "impulsividad",
  titulo: "¿Qué tan impulsivas son tus compras?",
  descripcionCorta: "Reflexiona sobre cómo decides tus compras del día a día.",
  categoria: "Hábitos de consumo",
  Icon: Zap,
  color: "#F8910C",
  bg: "#FFF3E0",
  minutos: 3,
  preguntas: [
    { id: "i1", texto: "Ves algo que te gusta en una tienda o red social, ¿qué haces?", opciones: [
      { texto: "Lo compro casi de inmediato", puntos: 1 },
      { texto: "Lo pienso un rato, pero casi siempre termino comprándolo", puntos: 2 },
      { texto: "Espero uno o dos días antes de decidir", puntos: 3 },
      { texto: "Lo agrego a una lista y lo evalúo con calma después", puntos: 4 },
    ]},
    { id: "i2", texto: "¿Con qué frecuencia compras algo que no tenías planeado?", opciones: [
      { texto: "Casi todos los días", puntos: 1 },
      { texto: "Varias veces por semana", puntos: 2 },
      { texto: "Una o dos veces por semana", puntos: 3 },
      { texto: "Muy rara vez", puntos: 4 },
    ]},
    { id: "i3", texto: "¿Las ofertas y descuentos influyen en tu decisión de compra?", opciones: [
      { texto: "Sí, compro solo porque está en oferta aunque no lo necesite", puntos: 1 },
      { texto: "Me atraen bastante, aunque a veces me freno", puntos: 2 },
      { texto: "Me llaman la atención pero evalúo si lo necesito", puntos: 3 },
      { texto: "Rara vez me hacen comprar algo que no planeaba", puntos: 4 },
    ]},
    { id: "i4", texto: "Después de una compra impulsiva, ¿cómo te sientes normalmente?", opciones: [
      { texto: "Culpa o arrepentimiento frecuente", puntos: 1 },
      { texto: "Contento al inicio, luego dudas", puntos: 2 },
      { texto: "Neutral, casi no me pasa", puntos: 3 },
      { texto: "Tranquilo, porque casi no compro sin pensar", puntos: 4 },
    ]},
    { id: "i5", texto: "¿Haces una lista antes de ir de compras?", opciones: [
      { texto: "Nunca", puntos: 1 },
      { texto: "Rara vez", puntos: 2 },
      { texto: "Casi siempre", puntos: 3 },
      { texto: "Siempre, y la sigo", puntos: 4 },
    ]},
    { id: "i6", texto: "¿Comprar te ayuda a manejar el estrés o las emociones?", opciones: [
      { texto: "Sí, compro cuando me siento mal o aburrido", puntos: 1 },
      { texto: "A veces lo hago sin darme cuenta", puntos: 2 },
      { texto: "Rara vez asocio comprar con mis emociones", puntos: 3 },
      { texto: "No, mis compras están separadas de cómo me siento", puntos: 4 },
    ]},
  ],
  niveles: [
    { min: 0, max: 10, perfil: "Comprador impulsivo", emoji: "⚡",
      descripcion: "Tus decisiones de compra suelen tomarse en el momento, guiadas por el antojo o la emoción más que por un plan. Esto puede estar afectando tu presupuesto sin que lo notes del todo.",
      fortalezas: ["Eres espontáneo y disfrutas el presente", "Te animas a probar cosas nuevas sin miedo", "Ya estás dispuesto a mirar este patrón de frente"],
      areasMejora: ["Las compras no planeadas son frecuentes", "Las emociones influyen mucho en tus decisiones de gasto", "Las ofertas te llevan a comprar cosas que no necesitas"],
      recomendaciones: ["Aplica la regla de las 24-48 horas: espera antes de comprar algo no planeado", "Antes de pagar, pregúntate '¿lo necesito o lo quiero en este momento?'", "Registra en BETA cada compra impulsiva para ver el patrón real al mes"],
      habitosSugeridos: ["Salir de compras con una lista y un límite de dinero definido", "Desactivar notificaciones de tiendas y apps que more te tientan", "Esperar a estar en un estado de ánimo neutral antes de comprar algo grande"],
      proximosPasos: ["Anota tus próximas 5 compras antes de hacerlas", "Haz el cuestionario de hábitos financieros para complementar este resultado"],
      recursos: ["Artículo: cómo frenar una compra impulsiva a tiempo", "Cuestionario: ¿cómo tomas decisiones de dinero?"] },
    { min: 11, max: 17, perfil: "Impulsivo ocasional", emoji: "🎯",
      descripcion: "La mayoría del tiempo lo piensas, pero ciertas situaciones —una oferta, un mal día— te llevan a comprar sin planearlo. Tienes buen control, con áreas específicas por trabajar.",
      fortalezas: ["Tienes cierto autocontrol la mayor parte del tiempo", "Reconoces cuándo una compra fue impulsiva", "Usas listas al menos parte del tiempo"],
      areasMejora: ["Las ofertas siguen siendo un punto débil", "El estado de ánimo a veces dicta tus compras", "Falta consistencia en el uso de listas"],
      recomendaciones: ["Identifica tus 'gatillos' más comunes (ofertas, aburrimiento, redes sociales)", "Fija un monto mensual destinado a compras espontáneas, así no te sientes culpable", "Antes de una oferta, compara el precio con lo que ya tenías planeado gastar"],
      habitosSugeridos: ["Revisar el carrito de compras 24 horas antes de pagar", "Anotar qué emoción sentías antes de una compra no planeada", "Usar siempre lista, aunque sea mental, al salir de compras"],
      proximosPasos: ["Define tu 'presupuesto de antojos' del mes", "Repite este cuestionario en unas semanas para medir tu progreso"],
      recursos: ["Artículo: el presupuesto de los gustos pequeños", "Reportes de BETA para ver tus categorías de gasto"] },
    { min: 18, max: 24, perfil: "Comprador consciente", emoji: "🧠",
      descripcion: "Tus decisiones de compra están guiadas principalmente por la razón, no por el impulso. Sabes esperar, comparar y decidir con calma.",
      fortalezas: ["Alto autocontrol frente a ofertas y antojos", "Usas listas de forma consistente", "Tus compras casi nunca generan arrepentimiento"],
      areasMejora: ["Podrías permitirte más flexibilidad ocasional sin culpa", "Vale la pena revisar si eres demasiado rígido en gustos pequeños", "Comparte tu método con quienes te rodean"],
      recomendaciones: ["Date permiso ocasional y planeado para un gusto, sin que rompa tu sistema", "Usa tu disciplina para enfocarte en metas de ahorro más grandes", "Explora el cuestionario de ahorro para canalizar este control"],
      habitosSugeridos: ["Revisar tus categorías de gasto una vez al mes", "Mantener tu sistema de listas también para compras pequeñas", "Celebrar (sin gastar de más) cuando cumples una meta"],
      proximosPasos: ["Define una meta de ahorro con el dinero que ya no gastas por impulso", "Haz el cuestionario de personalidad financiera"],
      recursos: ["Artículo: disciplina sin rigidez, el balance ideal", "Cuestionario: ¿qué tipo de ahorrador eres?"] },
  ],
};

// ────────────────────────────────────────────────────────────
// 3. ¿Cuál es tu personalidad financiera?
// ────────────────────────────────────────────────────────────
const personalidad: Cuestionario = {
  id: "personalidad",
  titulo: "¿Cuál es tu personalidad financiera?",
  descripcionCorta: "Conoce tu forma natural de relacionarte con el dinero.",
  categoria: "Autoconocimiento",
  Icon: Sparkles,
  color: "#26CBD1",
  bg: "#DDF6F7",
  minutos: 4,
  preguntas: [
    { id: "p1", texto: "Si te regalan $1,000 pesos sin condiciones, ¿qué es lo primero que piensas?", opciones: [
      { texto: "En qué me lo voy a gastar hoy mismo", puntos: 1 },
      { texto: "Algo que quería comprarme desde hace tiempo", puntos: 2 },
      { texto: "Cuánto puedo ahorrar de esto", puntos: 3 },
      { texto: "En qué invertirlo o hacerlo crecer", puntos: 4 },
    ]},
    { id: "p2", texto: "¿Cómo te sientes hablando de dinero con otras personas?", opciones: [
      { texto: "Incómodo, prefiero evitar el tema", puntos: 1 },
      { texto: "Depende de con quién", puntos: 2 },
      { texto: "Cómodo si es alguien de confianza", puntos: 3 },
      { texto: "Me gusta hablarlo abiertamente, incluso dar consejos", puntos: 4 },
    ]},
    { id: "p3", texto: "¿Qué palabra describe mejor tu relación con el dinero?", opciones: [
      { texto: "Ansiedad", puntos: 1 },
      { texto: "Indiferencia", puntos: 2 },
      { texto: "Cautela", puntos: 3 },
      { texto: "Curiosidad", puntos: 4 },
    ]},
    { id: "p4", texto: "Cuando piensas en el futuro financiero, ¿qué predomina?", opciones: [
      { texto: "Prefiero no pensarlo, me estresa", puntos: 1 },
      { texto: "Confío en que se resolverá solo", puntos: 2 },
      { texto: "Tengo ciertos planes, aunque no muy definidos", puntos: 3 },
      { texto: "Tengo metas claras y las voy ajustando", puntos: 4 },
    ]},
    { id: "p5", texto: "Ante un gasto grande inesperado, ¿cuál es tu reacción típica?", opciones: [
      { texto: "Pánico total", puntos: 1 },
      { texto: "Me estreso pero encuentro la forma", puntos: 2 },
      { texto: "Lo resuelvo con calma porque tengo un colchón", puntos: 3 },
      { texto: "Ya lo tenía contemplado como posibilidad", puntos: 4 },
    ]},
    { id: "p6", texto: "¿Qué te motiva más al pensar en dinero?", opciones: [
      { texto: "Evitar quedarme sin nada", puntos: 1 },
      { texto: "Disfrutar el presente", puntos: 2 },
      { texto: "Sentirme seguro a futuro", puntos: 3 },
      { texto: "Construir algo grande a largo plazo", puntos: 4 },
    ]},
  ],
  niveles: [
    { min: 0, max: 10, perfil: "El Evasor", emoji: "🙈",
      descripcion: "El dinero te genera cierta ansiedad, y por eso prefieres no pensarlo demasiado. Esto es más común de lo que parece, y reconocerlo ya es un gran paso.",
      fortalezas: ["Tienes sensibilidad emocional frente al dinero, lo cual te puede volver cuidadoso una vez que ganes confianza", "Estás abierto a aprender, ya que llegaste hasta este cuestionario", "No te dejas llevar por el ego al gastar"],
      areasMejora: ["Evitar el tema no lo hace desaparecer, solo posterga decisiones", "La falta de información alimenta la ansiedad", "No tener un plan genera más estrés a largo plazo"],
      recomendaciones: ["Empieza con pasos pequeños: revisa tu saldo una vez por semana, sin juicio", "Aprende un concepto financiero nuevo cada semana en Artículos", "Habla del tema con alguien de confianza para quitarle peso emocional"],
      habitosSugeridos: ["Revisar tus movimientos en BETA los domingos, en un momento tranquilo", "Anotar qué sientes cuando piensas en dinero, para identificar el origen", "Celebrar cada vez que revises tus finanzas sin evitarlo"],
      proximosPasos: ["Registra tu primer movimiento en BETA esta semana", "Haz el cuestionario de nivel de educación financiera para ubicar por dónde empezar"],
      recursos: ["Artículo: perder el miedo a ver tus finanzas", "Cuestionario: ¿cuál es tu nivel de educación financiera?"] },
    { min: 11, max: 17, perfil: "El Presente", emoji: "☀️",
      descripcion: "Disfrutas el ahora y prefieres no complicarte pensando demasiado en el futuro. Vives con menos estrés inmediato, aunque eso puede tener un costo a largo plazo.",
      fortalezas: ["Disfrutas tu dinero sin culpa excesiva", "Te adaptas fácilmente a los cambios", "Tienes una relación relajada, sin ansiedad extrema"],
      areasMejora: ["El futuro financiero queda poco planeado", "La falta de metas puede generar sorpresas más adelante", "Podrías beneficiarte de un pequeño colchón de seguridad"],
      recomendaciones: ["Define una meta pequeña a 3 meses, sin que sacrifique tu disfrute actual", "Aparta un porcentaje fijo, aunque sea mínimo, antes de gastar el resto", "Explora el cuestionario de ahorro para encontrar un método que te acomode"],
      habitosSugeridos: ["Apartar automáticamente un pequeño porcentaje de cada ingreso", "Revisar una vez al mes cómo va esa meta pequeña", "Disfrutar el presente sabiendo que también cuidas el futuro"],
      proximosPasos: ["Define tu primera meta de ahorro chica", "Haz el cuestionario de qué tipo de ahorrador eres"],
      recursos: ["Artículo: disfrutar hoy sin descuidar mañana", "Cuestionario: ¿qué tipo de ahorrador eres?"] },
    { min: 18, max: 21, perfil: "El Guardián", emoji: "🛡️",
      descripcion: "Te mueve la seguridad. Piensas en el futuro, cuidas tu dinero y prefieres tener un colchón antes que arriesgar. Es una base sólida para crecer con confianza.",
      fortalezas: ["Priorizas la seguridad financiera", "Tienes cierta planeación del futuro", "Manejas bien los imprevistos gracias a tu cautela"],
      areasMejora: ["A veces la cautela puede frenar oportunidades de crecimiento", "Podrías animarte a aprender sobre opciones para hacer crecer tus ahorros", "Vale la pena revisar metas más ambiciosas, no solo de protección"],
      recomendaciones: ["Explora conceptos básicos de cómo hacer crecer el dinero ahorrado, más allá de solo guardarlo", "Define metas a mediano plazo, no solo de emergencia", "Usa Reportes en BETA para ver tu progreso de forma objetiva"],
      habitosSugeridos: ["Revisar tus metas cada trimestre y ajustarlas", "Aprender un concepto nuevo sobre crecimiento del dinero cada mes", "Balancear seguridad con algo de disfrute planeado"],
      proximosPasos: ["Haz el cuestionario de qué tan preparado estás para una emergencia económica", "Define una meta financiera a 6 meses"],
      recursos: ["Artículo: de ahorrar a hacer crecer tu dinero", "Cuestionario: ¿qué tan preparado estás para una emergencia económica?"] },
    { min: 22, max: 24, perfil: "El Constructor", emoji: "🏗️",
      descripcion: "Ves el dinero como una herramienta para construir algo más grande. Tienes visión de largo plazo y te sientes cómodo hablando y planeando tus finanzas.",
      fortalezas: ["Visión clara de futuro financiero", "Comodidad hablando de dinero", "Motivación por construir, no solo por protegerte"],
      areasMejora: ["Cuidado con no dejar de disfrutar el presente por enfocarte solo en el futuro", "Vale la pena compartir tu conocimiento con otros", "Revisa que tus metas sigan alineadas a lo que realmente quieres, no solo a crecer por crecer"],
      recomendaciones: ["Define metas financieras a distintos plazos: corto, mediano y largo", "Usa BETA para llevar un registro detallado que respalde tu visión de crecimiento", "Considera mentorear o compartir lo que sabes con otros jóvenes"],
      habitosSugeridos: ["Revisar tus metas financieras cada mes", "Diversificar entre metas de crecimiento y de disfrute", "Documentar tu progreso para mantenerte motivado"],
      proximosPasos: ["Haz el cuestionario de qué tan cerca estás de tus metas financieras", "Comparte un consejo financiero con alguien esta semana"],
      recursos: ["Artículo: pensar en grande sin perder el presente", "Cuestionario: ¿qué tan cerca estás de alcanzar tus metas financieras?"] },
  ],
};

// ────────────────────────────────────────────────────────────
// 4. ¿Qué tan preparado estás para una emergencia económica?
// ────────────────────────────────────────────────────────────
const emergencia: Cuestionario = {
  id: "emergencia",
  titulo: "¿Qué tan preparado estás para una emergencia económica?",
  descripcionCorta: "Evalúa qué tan protegido estás ante un imprevisto.",
  categoria: "Seguridad financiera",
  Icon: ShieldCheck,
  color: "#84D175",
  bg: "#E4F7E1",
  minutos: 3,
  preguntas: [
    { id: "e1", texto: "Si mañana tuvieras un gasto inesperado de $2,000 pesos, ¿qué harías?", opciones: [
      { texto: "No sabría de dónde sacarlo", puntos: 1 },
      { texto: "Pediría prestado", puntos: 2 },
      { texto: "Usaría parte de mis ahorros, aunque me afecte", puntos: 3 },
      { texto: "Lo cubriría sin afectar mis planes", puntos: 4 },
    ]},
    { id: "e2", texto: "¿Tienes un fondo de ahorro específico para emergencias?", opciones: [
      { texto: "No, todo mi ahorro (si existe) tiene otro propósito", puntos: 1 },
      { texto: "Tengo un poco, pero lo uso para lo que sea", puntos: 2 },
      { texto: "Tengo algo apartado, aunque no es mucho", puntos: 3 },
      { texto: "Sí, tengo un fondo dedicado solo a emergencias", puntos: 4 },
    ]},
    { id: "e3", texto: "¿Cuántos meses de tus gastos básicos podrías cubrir sin ingresos?", opciones: [
      { texto: "Ninguno", puntos: 1 },
      { texto: "Menos de un mes", puntos: 2 },
      { texto: "Entre uno y dos meses", puntos: 3 },
      { texto: "Tres meses o más", puntos: 4 },
    ]},
    { id: "e4", texto: "¿Con qué frecuencia revisas si tu fondo de emergencia sigue ahí (sin haberlo usado en otra cosa)?", opciones: [
      { texto: "No aplica, no tengo uno", puntos: 1 },
      { texto: "Casi nunca lo reviso", puntos: 2 },
      { texto: "De vez en cuando", puntos: 3 },
      { texto: "Lo reviso regularmente", puntos: 4 },
    ]},
    { id: "e5", texto: "¿Qué tan protegido te sientes ante perder tu fuente de ingresos actual?", opciones: [
      { texto: "Nada protegido", puntos: 1 },
      { texto: "Un poco vulnerable", puntos: 2 },
      { texto: "Razonablemente protegido", puntos: 3 },
      { texto: "Muy protegido", puntos: 4 },
    ]},
  ],
  niveles: [
    { min: 0, max: 8, perfil: "Sin colchón todavía", emoji: "🌧️",
      descripcion: "Ahora mismo, un imprevisto económico te tomaría por sorpresa sin mucho margen de maniobra. Es una etapa muy común, sobre todo al empezar a manejar tu propio dinero.",
      fortalezas: ["Ya identificas que este es un punto a trabajar", "Tienes la oportunidad de empezar desde cero con buenos hábitos", "No cargas con malos hábitos de deuda por ahora"],
      areasMejora: ["No existe un fondo dedicado a emergencias", "La cobertura ante imprevistos es baja o nula", "Depende mucho de terceros ante un imprevisto"],
      recomendaciones: ["Empieza con una meta pequeña: ahorrar el equivalente a una semana de gastos básicos", "Abre (mentalmente o físicamente) un espacio separado solo para emergencias", "Usa BETA para registrar cuánto podrías apartar cada quincena, aunque sea poco"],
      habitosSugeridos: ["Apartar un monto fijo, aunque sea pequeño, cada vez que recibas dinero", "No tocar ese fondo para nada que no sea una emergencia real", "Revisar el fondo una vez al mes para ver cómo crece"],
      proximosPasos: ["Define hoy mismo un monto inicial para tu fondo de emergencia", "Haz el cuestionario de qué tipo de ahorrador eres para encontrar tu método"],
      recursos: ["Artículo: cómo armar tu primer fondo de emergencia", "Cuestionario: ¿qué tipo de ahorrador eres?"] },
    { min: 9, max: 14, perfil: "Colchón en construcción", emoji: "🧱",
      descripcion: "Ya tienes algo apartado o cierta capacidad de reacción, pero todavía no es suficiente para sentirte del todo tranquilo ante un imprevisto grande.",
      fortalezas: ["Ya diste el primer paso con algo de ahorro", "Tienes cierta capacidad de reacción ante imprevistos", "Entiendes la importancia de tener un fondo"],
      areasMejora: ["El fondo actual cubre menos de lo ideal", "No siempre está separado de otros propósitos de ahorro", "Falta constancia en aportar a este fondo"],
      recomendaciones: ["Define una meta clara: cubrir al menos un mes completo de gastos básicos", "Separa este fondo físicamente o en una categoría distinta en BETA", "Aporta un monto fijo cada quincena, aunque el resto se ajuste"],
      habitosSugeridos: ["Aportar al fondo antes de gastar en otras cosas", "Revisar el avance cada mes en Reportes", "Evitar usar este dinero para gastos que no sean emergencias reales"],
      proximosPasos: ["Calcula cuánto necesitas para cubrir un mes de gastos básicos", "Revisa tu progreso en un mes con este mismo cuestionario"],
      recursos: ["Artículo: cuánto necesitas realmente en tu fondo de emergencia", "Reportes mensuales de BETA"] },
    { min: 15, max: 18, perfil: "Bien resguardado", emoji: "🏠",
      descripcion: "Tienes un colchón razonable que te da cierta tranquilidad ante imprevistos. Con algunos ajustes puedes llegar a sentirte completamente protegido.",
      fortalezas: ["Cuentas con un fondo dedicado a emergencias", "Tienes capacidad real de cubrir algunos meses sin ingresos", "Revisas tu fondo con cierta regularidad"],
      areasMejora: ["Podrías ampliar la cobertura a 3 meses o más", "Vale la pena automatizar los aportes", "Revisa que el fondo no se mezcle con otros ahorros"],
      recomendaciones: ["Aumenta tu meta a 3 meses de gastos básicos cubiertos", "Automatiza un aporte fijo cada quincena hacia este fondo", "Usa el cuestionario de metas financieras para balancear este fondo con otros objetivos"],
      habitosSugeridos: ["Revisar el fondo cada mes junto con tus reportes", "Ajustar la meta si tus gastos básicos cambian", "Mantener este fondo completamente separado de gastos del día a día"],
      proximosPasos: ["Define el monto exacto para llegar a 3 meses de cobertura", "Haz el cuestionario de metas financieras"],
      recursos: ["Artículo: llevar tu fondo de emergencia al siguiente nivel", "Cuestionario: ¿qué tan cerca estás de tus metas financieras?"] },
    { min: 19, max: 20, perfil: "Blindado", emoji: "🛡️",
      descripcion: "Tienes una protección sólida ante imprevistos. Esto te da una base de tranquilidad poco común, sobre todo a tu edad, y te permite tomar otras decisiones financieras con más confianza.",
      fortalezas: ["Fondo de emergencia sólido y bien separado", "Cobertura de tres meses o más", "Revisión constante y disciplinada"],
      areasMejora: ["Podrías empezar a pensar en metas de crecimiento, no solo de protección", "Comparte tu método, es poco común a tu edad", "Revisa si el monto sigue siendo adecuado si tus gastos cambian"],
      recomendaciones: ["Con esta base, explora metas financieras de crecimiento a mediano plazo", "Revisa el cuestionario de personalidad financiera para definir tu siguiente paso", "Considera enseñar este hábito a alguien más"],
      habitosSugeridos: ["Revisar el fondo cada trimestre en vez de cada mes, ya que está estable", "Redirigir el ahorro extra hacia nuevas metas", "Mantener la disciplina que ya tienes"],
      proximosPasos: ["Define una meta de crecimiento a 6 meses o un año", "Haz el cuestionario de personalidad financiera"],
      recursos: ["Artículo: del colchón de emergencia a las metas de crecimiento", "Cuestionario: ¿cuál es tu personalidad financiera?"] },
  ],
};

// ────────────────────────────────────────────────────────────
// 5. ¿Qué hábitos financieros deberías mejorar?
// ────────────────────────────────────────────────────────────
const habitos: Cuestionario = {
  id: "habitos",
  titulo: "¿Qué hábitos financieros deberías mejorar?",
  descripcionCorta: "Detecta qué costumbres te conviene ajustar primero.",
  categoria: "Hábitos",
  Icon: Wrench,
  color: "#AE6D21",
  bg: "#FFF3A8",
  minutos: 3,
  preguntas: [
    { id: "h1", texto: "¿Con qué frecuencia revisas tu saldo disponible?", opciones: [
      { texto: "Casi nunca", puntos: 1 },
      { texto: "Solo cuando algo me preocupa", puntos: 2 },
      { texto: "Una vez por semana", puntos: 3 },
      { texto: "Con frecuencia, es parte de mi rutina", puntos: 4 },
    ]},
    { id: "h2", texto: "¿Pagas tus compromisos (servicios, deudas pequeñas) a tiempo?", opciones: [
      { texto: "Casi siempre se me pasa la fecha", puntos: 1 },
      { texto: "A veces se me olvida", puntos: 2 },
      { texto: "Casi siempre a tiempo", puntos: 3 },
      { texto: "Siempre, tengo recordatorios o los pago apenas puedo", puntos: 4 },
    ]},
    { id: "h3", texto: "¿Comparas precios antes de una compra importante?", opciones: [
      { texto: "Nunca", puntos: 1 },
      { texto: "Rara vez", puntos: 2 },
      { texto: "Casi siempre", puntos: 3 },
      { texto: "Siempre que puedo", puntos: 4 },
    ]},
    { id: "h4", texto: "¿Tienes alguna meta de ahorro activa en este momento?", opciones: [
      { texto: "No, nunca me lo planteo", puntos: 1 },
      { texto: "Lo pienso, pero no la defino en concreto", puntos: 2 },
      { texto: "Tengo una idea, aunque no muy formal", puntos: 3 },
      { texto: "Sí, tengo una meta clara y activa", puntos: 4 },
    ]},
    { id: "h5", texto: "¿Qué tan seguido gastas más de lo que planeabas?", opciones: [
      { texto: "Casi siempre", puntos: 1 },
      { texto: "Frecuentemente", puntos: 2 },
      { texto: "De vez en cuando", puntos: 3 },
      { texto: "Casi nunca", puntos: 4 },
    ]},
  ],
  niveles: [
    { min: 0, max: 8, perfil: "Hábitos por construir", emoji: "🔧",
      descripcion: "Hay varias costumbres básicas que aún no forman parte de tu rutina financiera. La buena noticia es que son fáciles de empezar a construir, un poco a la vez.",
      fortalezas: ["Estás dispuesto a identificar qué mejorar, lo cual ya es un avance", "Tienes la oportunidad de construir hábitos desde una base limpia", "No hay resistencia al cambio, solo falta empezar"],
      areasMejora: ["No hay una rutina de revisión del dinero", "Los compromisos de pago no siempre se cumplen a tiempo", "No existen metas de ahorro definidas"],
      recomendaciones: ["Elige un solo hábito para trabajar esta semana, por ejemplo revisar tu saldo cada domingo", "Pon recordatorios para tus pagos importantes", "Define una meta de ahorro simple, aunque sea pequeña, para empezar a practicar"],
      habitosSugeridos: ["Revisar tu saldo un día fijo de la semana", "Poner alarmas o recordatorios para pagos", "Anotar una meta de ahorro, aunque sea modesta"],
      proximosPasos: ["Elige tu primer hábito a mejorar esta semana", "Haz el cuestionario de cómo administras tu dinero para complementar"],
      recursos: ["Artículo: pequeños hábitos, grandes resultados", "Cuestionario: ¿cómo administras tu dinero?"] },
    { min: 9, max: 14, perfil: "Hábitos en desarrollo", emoji: "🌿",
      descripcion: "Ya tienes algunas costumbres saludables, pero no son del todo constantes. Con un poco más de disciplina, estos hábitos se pueden consolidar pronto.",
      fortalezas: ["Revisas tu dinero con cierta frecuencia", "Tienes noción de tus compromisos de pago", "Ya piensas en metas de ahorro, aunque no estén definidas del todo"],
      areasMejora: ["Falta consistencia en la revisión del saldo", "Las metas de ahorro no están del todo formalizadas", "Los gastos a veces se salen del plan"],
      recomendaciones: ["Fija un día y hora específicos para tu revisión semanal de dinero", "Convierte tu idea de ahorro en una meta con monto y fecha", "Usa Reportes en BETA para ver en qué momentos se te sale el presupuesto"],
      habitosSugeridos: ["Revisar el saldo el mismo día cada semana", "Definir metas con número y fecha, no solo una idea general", "Comparar gasto planeado contra gasto real cada quincena"],
      proximosPasos: ["Formaliza tu meta de ahorro esta semana", "Haz el cuestionario de qué tipo de ahorrador eres"],
      recursos: ["Artículo: de la intención a la meta concreta", "Cuestionario: ¿qué tipo de ahorrador eres?"] },
    { min: 15, max: 18, perfil: "Hábitos sólidos", emoji: "💪",
      descripcion: "Tienes una base de hábitos financieros saludable y consistente. Cumples tus compromisos, revisas tu dinero y ya piensas en metas concretas.",
      fortalezas: ["Revisión constante de tu situación financiera", "Cumplimiento puntual de tus compromisos", "Metas de ahorro activas y claras"],
      areasMejora: ["Podrías afinar el control sobre gastos no planeados", "Vale la pena diversificar tus metas (corto y largo plazo)", "Comparte tus hábitos, pueden inspirar a otros"],
      recomendaciones: ["Define una meta de ahorro a más largo plazo, ahora que tienes buena base", "Revisa tus categorías de gasto para encontrar el último punto de fuga", "Explora el cuestionario de metas financieras para llevar esto más lejos"],
      habitosSugeridos: ["Revisar reportes mensuales, no solo el saldo semanal", "Ajustar metas cada trimestre", "Mantener el mismo nivel de disciplina en épocas de más gasto (vacaciones, fiestas)"],
      proximosPasos: ["Define una meta de ahorro a 6 meses", "Haz el cuestionario de qué tan cerca estás de tus metas financieras"],
      recursos: ["Artículo: mantener la disciplina en temporadas difíciles", "Cuestionario: ¿qué tan cerca estás de alcanzar tus metas financieras?"] },
  ],
};

// ────────────────────────────────────────────────────────────
// 6. ¿Qué tipo de ahorrador eres?
// ────────────────────────────────────────────────────────────
const ahorro: Cuestionario = {
  id: "ahorro",
  titulo: "¿Qué tipo de ahorrador eres?",
  descripcionCorta: "Identifica tu estilo natural para guardar dinero.",
  categoria: "Ahorro",
  Icon: PiggyBank,
  color: "#5FA463",
  bg: "#E6FBDA",
  minutos: 3,
  preguntas: [
    { id: "s1", texto: "¿Cómo defines tus metas de ahorro?", opciones: [
      { texto: "No tengo metas de ahorro", puntos: 1 },
      { texto: "Ahorro lo que sobra, sin meta específica", puntos: 2 },
      { texto: "Tengo una meta general en mente", puntos: 3 },
      { texto: "Tengo metas con monto y fecha definidos", puntos: 4 },
    ]},
    { id: "s2", texto: "¿Cuándo apartas el dinero que ahorras?", opciones: [
      { texto: "Nunca aparto, si sobra algo ya fue suerte", puntos: 1 },
      { texto: "Al final del mes, si queda algo", puntos: 2 },
      { texto: "Trato de apartarlo pronto, aunque no siempre lo logro", puntos: 3 },
      { texto: "Aparto primero, antes de gastar en lo demás", puntos: 4 },
    ]},
    { id: "s3", texto: "¿Qué tan seguido rompes tus propios ahorros para gastos no planeados?", opciones: [
      { texto: "Muy seguido", puntos: 1 },
      { texto: "De vez en cuando", puntos: 2 },
      { texto: "Rara vez", puntos: 3 },
      { texto: "Casi nunca, el ahorro es intocable", puntos: 4 },
    ]},
    { id: "s4", texto: "¿Tienes más de un 'bote' o destino para tu ahorro (emergencia, meta, gusto)?", opciones: [
      { texto: "No, todo el ahorro es lo mismo", puntos: 1 },
      { texto: "Tengo una idea, pero no está separado en la práctica", puntos: 2 },
      { texto: "Tengo dos destinos distintos", puntos: 3 },
      { texto: "Tengo varios destinos claramente separados", puntos: 4 },
    ]},
    { id: "s5", texto: "¿Cómo te sientes cuando ves crecer tu ahorro?", opciones: [
      { texto: "No lo reviso lo suficiente para notarlo", puntos: 1 },
      { texto: "Bien, aunque no le doy mucho seguimiento", puntos: 2 },
      { texto: "Me motiva a seguir ahorrando", puntos: 3 },
      { texto: "Es una de mis principales motivaciones financieras", puntos: 4 },
    ]},
  ],
  niveles: [
    { min: 0, max: 8, perfil: "Ahorrador ocasional", emoji: "🌤️",
      descripcion: "El ahorro no es todavía una costumbre constante para ti; ocurre cuando sobra dinero, más que como una decisión deliberada.",
      fortalezas: ["No te genera estrés no ahorrar constantemente", "Estás abierto a construir el hábito desde cero", "Tienes flexibilidad para adaptar un nuevo sistema"],
      areasMejora: ["No existe una meta de ahorro clara", "El ahorro depende de lo que sobra, no de una decisión previa", "No hay separación entre distintos tipos de ahorro"],
      recomendaciones: ["Define una meta pequeña y concreta: monto y fecha", "Aparta el ahorro apenas recibas dinero, no al final", "Empieza con un solo destino de ahorro antes de complicarlo con varios"],
      habitosSugeridos: ["Apartar un monto fijo, aunque sea pequeño, al recibir cualquier ingreso", "Revisar el avance de tu ahorro cada quincena", "Evitar tocar el ahorro salvo para lo que fue planeado"],
      proximosPasos: ["Define hoy tu primera meta de ahorro con monto y fecha", "Haz el cuestionario de qué tan preparado estás para una emergencia económica"],
      recursos: ["Artículo: cómo empezar a ahorrar sin que se sienta un sacrificio", "Cuestionario: ¿qué tan preparado estás para una emergencia económica?"] },
    { min: 9, max: 13, perfil: "Ahorrador intencional", emoji: "🌱",
      descripcion: "Ya tienes la intención clara de ahorrar y algo de estructura, aunque todavía no es un hábito completamente consolidado.",
      fortalezas: ["Tienes una meta general en mente", "Intentas apartar el dinero pronto, no solo al final", "Ya reconoces el valor de ver crecer tu ahorro"],
      areasMejora: ["La meta podría ser más específica (monto y fecha)", "El ahorro a veces se rompe para gastos no planeados", "Falta separar el ahorro en distintos destinos"],
      recomendaciones: ["Convierte tu meta general en una con número y fecha exacta", "Crea un segundo destino de ahorro, por ejemplo emergencia y un gusto", "Revisa tu ahorro en Reportes para mantenerte motivado"],
      habitosSugeridos: ["Revisar el progreso de tu meta cada quincena", "Separar mentalmente o en la práctica dos tipos de ahorro", "Evitar romper el ahorro salvo emergencias reales"],
      proximosPasos: ["Define el monto y la fecha exacta de tu meta actual", "Haz el cuestionario de metas financieras"],
      recursos: ["Artículo: metas de ahorro que sí se cumplen", "Cuestionario: ¿qué tan cerca estás de alcanzar tus metas financieras?"] },
    { min: 14, max: 17, perfil: "Ahorrador estructurado", emoji: "🏦",
      descripcion: "Tienes un sistema de ahorro que funciona: metas claras, separación de destinos y consistencia. Esto te da una ventaja importante a tu edad.",
      fortalezas: ["Metas de ahorro con monto y fecha definidos", "Apartas el dinero antes de gastar en lo demás", "Tienes distintos destinos para tu ahorro"],
      areasMejora: ["Podrías aumentar gradualmente el monto que apartas", "Vale la pena revisar si tus metas siguen alineadas a lo que quieres", "Comparte tu sistema, es poco común a tu edad"],
      recomendaciones: ["Aumenta tu meta de ahorro en un porcentaje pequeño cada trimestre", "Explora el cuestionario de personalidad financiera para definir hacia dónde dirigir el crecimiento", "Revisa tus metas cada trimestre para mantenerlas relevantes"],
      habitosSugeridos: ["Revisar tus metas de ahorro cada trimestre", "Aumentar gradualmente el porcentaje que ahorras", "Mantener la separación clara entre tus distintos destinos de ahorro"],
      proximosPasos: ["Aumenta tu meta actual en un 10%", "Haz el cuestionario de personalidad financiera"],
      recursos: ["Artículo: llevar tu ahorro al siguiente nivel", "Cuestionario: ¿cuál es tu personalidad financiera?"] },
    { min: 18, max: 20, perfil: "Ahorrador maestro", emoji: "👑",
      descripcion: "El ahorro es una parte natural y disciplinada de tu vida financiera. Tienes metas claras, múltiples destinos y una motivación genuina por ver crecer tu dinero.",
      fortalezas: ["Sistema de ahorro sólido y consistente", "Motivación genuina en el proceso, no solo en el resultado", "Separación clara entre distintos objetivos de ahorro"],
      areasMejora: ["Podrías empezar a explorar cómo hacer crecer aún más ese ahorro", "Vale la pena documentar tu método para enseñarlo a otros", "Revisa que el ahorro no limite disfrutar experiencias importantes"],
      recomendaciones: ["Explora conceptos de cómo hacer crecer el dinero que ya ahorras", "Define una meta ambiciosa a un año con este nivel de disciplina", "Considera compartir tu sistema con amigos o compañeros de equipo"],
      habitosSugeridos: ["Revisar el rendimiento de tus distintos ahorros cada trimestre", "Balancear ahorro con experiencias que también te aporten valor", "Actualizar tus metas conforme cambian tus circunstancias"],
      proximosPasos: ["Define una meta de ahorro a un año", "Haz el cuestionario de qué tan cerca estás de tus metas financieras"],
      recursos: ["Artículo: de ahorrar a construir patrimonio", "Cuestionario: ¿qué tan cerca estás de alcanzar tus metas financieras?"] },
  ],
};

// ────────────────────────────────────────────────────────────
// 7. ¿Cómo tomas decisiones relacionadas con el dinero?
// ────────────────────────────────────────────────────────────
const decisiones: Cuestionario = {
  id: "decisiones",
  titulo: "¿Cómo tomas decisiones relacionadas con el dinero?",
  descripcionCorta: "Analiza tu proceso mental antes de gastar o ahorrar.",
  categoria: "Toma de decisiones",
  Icon: Brain,
  color: "#405FFA",
  bg: "#DCEBFB",
  minutos: 3,
  preguntas: [
    { id: "d1", texto: "Antes de una decisión de dinero importante, ¿qué haces?", opciones: [
      { texto: "Decido en el momento, sin pensarlo mucho", puntos: 1 },
      { texto: "Lo pienso un poco, pero decido rápido", puntos: 2 },
      { texto: "Comparo opciones antes de decidir", puntos: 3 },
      { texto: "Analizo a fondo, incluso pido otras opiniones", puntos: 4 },
    ]},
    { id: "d2", texto: "¿Qué papel juegan tus emociones en tus decisiones de dinero?", opciones: [
      { texto: "Deciden casi todo", puntos: 1 },
      { texto: "Influyen bastante", puntos: 2 },
      { texto: "Influyen un poco, pero la razón manda", puntos: 3 },
      { texto: "Casi no influyen, decido con la cabeza fría", puntos: 4 },
    ]},
    { id: "d3", texto: "¿Sueles pedir opinión a alguien más antes de un gasto grande?", opciones: [
      { texto: "Nunca", puntos: 1 },
      { texto: "Rara vez", puntos: 2 },
      { texto: "A veces, si es un monto importante", puntos: 3 },
      { texto: "Casi siempre, me gusta contrastar opiniones", puntos: 4 },
    ]},
    { id: "d4", texto: "¿Qué tan seguido te arrepientes de una decisión de dinero?", opciones: [
      { texto: "Con mucha frecuencia", puntos: 1 },
      { texto: "De vez en cuando", puntos: 2 },
      { texto: "Rara vez", puntos: 3 },
      { texto: "Casi nunca", puntos: 4 },
    ]},
    { id: "d5", texto: "¿Consideras el impacto a largo plazo de tus decisiones financieras?", opciones: [
      { texto: "Casi nunca pienso más allá del momento", puntos: 1 },
      { texto: "A veces lo considero", puntos: 2 },
      { texto: "Generalmente sí lo pienso", puntos: 3 },
      { texto: "Siempre pienso en el impacto futuro antes de decidir", puntos: 4 },
    ]},
  ],
  niveles: [
    { min: 0, max: 8, perfil: "Decisor intuitivo", emoji: "💭",
      descripcion: "Tomas tus decisiones de dinero principalmente por instinto o emoción, sin mucho análisis previo. Esto puede llevarte a resultados inconsistentes.",
      fortalezas: ["Decides rápido, sin quedarte atorado pensando", "Confías en tu intuición", "Estás abierto a mejorar tu proceso de decisión"],
      areasMejora: ["Las emociones dominan gran parte de tus decisiones", "No sueles comparar opciones antes de decidir", "El arrepentimiento post-decisión es frecuente"],
      recomendaciones: ["Antes de un gasto grande, espera al menos un día antes de decidir", "Haz una lista simple de pros y contras para decisiones importantes", "Pide una segunda opinión antes de comprometer dinero relevante"],
      habitosSugeridos: ["Aplicar una pausa de 24 horas antes de decisiones grandes", "Escribir 2-3 opciones distintas antes de elegir", "Preguntarte cómo te sentirás con esta decisión en un mes"],
      proximosPasos: ["Aplica la pausa de 24 horas en tu próxima decisión grande", "Haz el cuestionario de qué tan impulsivas son tus compras"],
      recursos: ["Artículo: decidir con calma sin perder espontaneidad", "Cuestionario: ¿qué tan impulsivas son tus compras?"] },
    { min: 9, max: 13, perfil: "Decisor en equilibrio", emoji: "⚖️",
      descripcion: "Combinas intuición con algo de análisis. No siempre comparas todas las opciones, pero tampoco decides completamente a ciegas.",
      fortalezas: ["Balance entre rapidez y análisis", "Consideras el impacto futuro al menos parte del tiempo", "Pides opinión en decisiones que sientes importantes"],
      areasMejora: ["El análisis podría ser más consistente en decisiones grandes", "Las emociones aún influyen más de lo ideal", "El impacto a largo plazo no siempre se considera"],
      recomendaciones: ["Define un monto a partir del cual siempre compares al menos dos opciones", "Practica preguntarte '¿cómo afecta esto mis metas a 6 meses?'", "Usa Reportes en BETA para revisar el resultado de tus decisiones pasadas"],
      habitosSugeridos: ["Comparar precios u opciones en compras mayores a cierto monto", "Anotar brevemente el motivo detrás de decisiones grandes", "Revisar después si la decisión resultó como esperabas"],
      proximosPasos: ["Define tu 'monto umbral' para siempre comparar opciones", "Haz el cuestionario de personalidad financiera"],
      recursos: ["Artículo: decisiones financieras con criterio propio", "Cuestionario: ¿cuál es tu personalidad financiera?"] },
    { min: 14, max: 17, perfil: "Decisor analítico", emoji: "🔍",
      descripcion: "Tomas tus decisiones de dinero con calma, comparando opciones y pensando en el largo plazo. Esto te da resultados más consistentes.",
      fortalezas: ["Analizas bien antes de decidir", "Consideras el impacto a futuro con frecuencia", "Rara vez te arrepientes de tus decisiones"],
      areasMejora: ["Cuidado con el exceso de análisis que retrase decisiones simples", "Podrías confiar un poco más en tu intuición en decisiones pequeñas", "Comparte tu método de decisión con otros"],
      recomendaciones: ["Reserva el análisis profundo solo para decisiones realmente importantes", "Confía en decisiones rápidas para gastos pequeños y frecuentes", "Usa tu buen criterio para definir metas financieras más ambiciosas"],
      habitosSugeridos: ["Definir qué tipo de decisiones sí requieren análisis profundo y cuáles no", "Revisar tus decisiones pasadas para reforzar la confianza en tu criterio", "Compartir tu proceso de decisión con quien te lo pida"],
      proximosPasos: ["Define qué decisiones no necesitan tanto análisis", "Haz el cuestionario de qué tan cerca estás de tus metas financieras"],
      recursos: ["Artículo: analizar sin paralizarte", "Cuestionario: ¿qué tan cerca estás de alcanzar tus metas financieras?"] },
  ],
};

// ────────────────────────────────────────────────────────────
// 8. ¿Qué tan cerca estás de alcanzar tus metas financieras?
// ────────────────────────────────────────────────────────────
const metas: Cuestionario = {
  id: "metas",
  titulo: "¿Qué tan cerca estás de alcanzar tus metas financieras?",
  descripcionCorta: "Mide tu avance real hacia lo que quieres lograr.",
  categoria: "Metas",
  Icon: Target,
  color: "#F8910C",
  bg: "#FFF3E0",
  minutos: 3,
  preguntas: [
    { id: "m1", texto: "¿Tienes una meta financiera específica en este momento?", opciones: [
      { texto: "No tengo ninguna meta definida", puntos: 1 },
      { texto: "Tengo una idea general, sin detalles", puntos: 2 },
      { texto: "Tengo una meta con monto aproximado", puntos: 3 },
      { texto: "Tengo una meta con monto y fecha exactos", puntos: 4 },
    ]},
    { id: "m2", texto: "¿Qué porcentaje de tu meta llevas avanzado?", opciones: [
      { texto: "0%, aún no empiezo", puntos: 1 },
      { texto: "Menos de una cuarta parte", puntos: 2 },
      { texto: "Voy a la mitad o más", puntos: 3 },
      { texto: "Estoy cerca de completarla", puntos: 4 },
    ]},
    { id: "m3", texto: "¿Con qué regularidad avanzas hacia esa meta?", opciones: [
      { texto: "No avanzo de forma regular", puntos: 1 },
      { texto: "Avanzo de vez en cuando", puntos: 2 },
      { texto: "Avanzo casi cada quincena", puntos: 3 },
      { texto: "Avanzo de forma constante, sin falta", puntos: 4 },
    ]},
    { id: "m4", texto: "¿Qué tan seguido revisas tu progreso hacia la meta?", opciones: [
      { texto: "Nunca lo reviso", puntos: 1 },
      { texto: "Rara vez", puntos: 2 },
      { texto: "Una vez al mes", puntos: 3 },
      { texto: "Cada quincena o más seguido", puntos: 4 },
    ]},
    { id: "m5", texto: "Si algo interrumpe tu plan (un gasto grande), ¿qué haces?", opciones: [
      { texto: "Abandono la meta por completo", puntos: 1 },
      { texto: "La pauso sin fecha para retomarla", puntos: 2 },
      { texto: "La ajusto y sigo, aunque más lento", puntos: 3 },
      { texto: "Tengo un plan flexible que absorbe estos cambios", puntos: 4 },
    ]},
  ],
  niveles: [
    { min: 0, max: 8, perfil: "Punto de partida", emoji: "🚩",
      descripcion: "Todavía no tienes una meta financiera concreta en marcha, o apenas está en la idea inicial. Es el mejor momento para definir una y empezar a avanzar.",
      fortalezas: ["Tienes la disposición de reflexionar sobre tus metas", "No cargas con el peso de una meta abandonada", "Puedes construir un plan realista desde cero"],
      areasMejora: ["No existe una meta con monto y fecha definidos", "No hay un avance medible todavía", "Falta un sistema de revisión de progreso"],
      recomendaciones: ["Elige una sola meta para empezar, con un monto y una fecha realistas", "Divide la meta en aportes quincenales pequeños y alcanzables", "Usa BETA para registrar cada aporte hacia esa meta"],
      habitosSugeridos: ["Definir la meta por escrito, con número y fecha", "Aportar un monto fijo cada quincena hacia la meta", "Revisar el avance cada quincena, aunque sea poco"],
      proximosPasos: ["Define tu primera meta financiera hoy mismo", "Haz el cuestionario de qué tipo de ahorrador eres"],
      recursos: ["Artículo: cómo definir tu primera meta financiera", "Cuestionario: ¿qué tipo de ahorrador eres?"] },
    { min: 9, max: 13, perfil: "En camino", emoji: "🚶",
      descripcion: "Ya tienes una meta en marcha y algo de avance, aunque de forma irregular. Con un poco más de constancia, puedes acelerar bastante el progreso.",
      fortalezas: ["Ya tienes una meta con cierto nivel de definición", "Has avanzado, aunque sea parcialmente", "Revisas tu progreso al menos ocasionalmente"],
      areasMejora: ["La regularidad de los aportes podría mejorar", "La revisión de progreso no es del todo constante", "Los imprevistos a veces frenan el avance por completo"],
      recomendaciones: ["Automatiza o programa un aporte fijo cada quincena para no depender de acordarte", "Revisa tu avance cada quincena junto con tus reportes en BETA", "Ten un plan B para cuando surja un imprevisto, en vez de abandonar la meta"],
      habitosSugeridos: ["Aportar a la meta el mismo día que recibes tu dinero", "Revisar el progreso cada quincena sin falta", "Ajustar la meta en vez de abandonarla ante un imprevisto"],
      proximosPasos: ["Programa tu próximo aporte para esta quincena", "Repite este cuestionario en un mes para medir tu constancia"],
      recursos: ["Artículo: la constancia vale más que el monto", "Reportes quincenales de BETA"] },
    { min: 14, max: 17, perfil: "Cerca de la meta", emoji: "🏁",
      descripcion: "Vas muy bien encaminado: tu meta está clara, avanzas con regularidad y sabes ajustar el plan cuando algo cambia. Estás cerca de lograrlo.",
      fortalezas: ["Meta clara con monto y fecha definidos", "Avance regular y medible", "Capacidad de adaptar el plan ante imprevistos"],
      areasMejora: ["Podrías definir ya tu siguiente meta, para no perder el impulso", "Vale la pena celebrar los avances parciales, no solo el resultado final", "Comparte tu método con otros que buscan lograr algo similar"],
      recomendaciones: ["Define tu siguiente meta desde ahora, para mantener el impulso al terminar esta", "Celebra el avance del 75% o 90%, no solo el 100%", "Explora el cuestionario de personalidad financiera para orientar tu siguiente meta"],
      habitosSugeridos: ["Revisar el progreso semanalmente en el tramo final", "Planear la siguiente meta antes de terminar la actual", "Documentar qué funcionó para repetirlo después"],
      proximosPasos: ["Define tu próxima meta financiera desde ahora", "Haz el cuestionario de personalidad financiera"],
      recursos: ["Artículo: qué hacer cuando logras una meta financiera", "Cuestionario: ¿cuál es tu personalidad financiera?"] },
  ],
};

// ────────────────────────────────────────────────────────────
// 9. ¿Cuál es tu nivel de educación financiera?
// ────────────────────────────────────────────────────────────
const educacion: Cuestionario = {
  id: "educacion",
  titulo: "¿Cuál es tu nivel de educación financiera?",
  descripcionCorta: "Un vistazo honesto a cuánto sabes y qué te falta aprender.",
  categoria: "Educación financiera",
  Icon: GraduationCap,
  color: "#26CBD1",
  bg: "#DDF6F7",
  minutos: 4,
  preguntas: [
    { id: "ed1", texto: "¿Qué tan cómodo te sientes explicando qué es un presupuesto?", opciones: [
      { texto: "No sabría por dónde empezar", puntos: 1 },
      { texto: "Tengo una idea básica", puntos: 2 },
      { texto: "Podría explicarlo bien", puntos: 3 },
      { texto: "Lo explico y lo aplico en mi día a día", puntos: 4 },
    ]},
    { id: "ed2", texto: "¿Sabes qué es el interés compuesto?", opciones: [
      { texto: "No tengo idea", puntos: 1 },
      { texto: "He escuchado el término, pero no lo entiendo bien", puntos: 2 },
      { texto: "Entiendo el concepto general", puntos: 3 },
      { texto: "Lo entiendo bien y sé cómo aplicarlo a mi favor", puntos: 4 },
    ]},
    { id: "ed3", texto: "¿Qué tanto sabes sobre cómo funciona el crédito?", opciones: [
      { texto: "Muy poco o nada", puntos: 1 },
      { texto: "Sé lo básico", puntos: 2 },
      { texto: "Entiendo cómo funciona y sus riesgos", puntos: 3 },
      { texto: "Lo entiendo a fondo, incluyendo cómo construir buen historial", puntos: 4 },
    ]},
    { id: "ed4", texto: "¿Con qué frecuencia buscas aprender sobre temas de dinero por tu cuenta?", opciones: [
      { texto: "Nunca", puntos: 1 },
      { texto: "Muy rara vez", puntos: 2 },
      { texto: "De vez en cuando", puntos: 3 },
      { texto: "Con frecuencia, me interesa el tema", puntos: 4 },
    ]},
    { id: "ed5", texto: "¿Sabes identificar cuándo una inversión u oportunidad es una posible estafa?", opciones: [
      { texto: "No sabría distinguirlo", puntos: 1 },
      { texto: "Tengo dudas frecuentes", puntos: 2 },
      { texto: "Identifico las señales más comunes", puntos: 3 },
      { texto: "Me siento seguro identificando riesgos y señales de alerta", puntos: 4 },
    ]},
    { id: "ed6", texto: "¿Qué tan preparado te sientes para tomar decisiones financieras importantes (como un primer crédito o una inversión)?", opciones: [
      { texto: "Nada preparado", puntos: 1 },
      { texto: "Un poco inseguro todavía", puntos: 2 },
      { texto: "Razonablemente preparado", puntos: 3 },
      { texto: "Me siento bien preparado", puntos: 4 },
    ]},
  ],
  niveles: [
    { min: 0, max: 10, perfil: "Principiante curioso", emoji: "🌱",
      descripcion: "Estás en las primeras etapas de tu educación financiera, y eso está perfecto: todos empiezan por aquí. Lo importante es que ya diste el primer paso al reflexionar sobre esto.",
      fortalezas: ["Tienes curiosidad genuina, ya que llegaste hasta este cuestionario", "No cargas con conceptos mal aprendidos que desaprender", "Tienes toda la plataforma de BETA para aprender a tu ritmo"],
      areasMejora: ["Conceptos básicos como presupuesto o interés compuesto aún no son claros", "No hay hábito de aprender sobre finanzas por cuenta propia", "La identificación de riesgos (como estafas) es limitada"],
      recomendaciones: ["Empieza por un artículo corto a la semana en el módulo educativo de BETA", "Aprende primero qué es un presupuesto y practícalo con tus propios movimientos", "No te compares con otros, tu ritmo de aprendizaje es válido"],
      habitosSugeridos: ["Leer un artículo corto por semana en BETA", "Anotar una palabra o concepto nuevo cada vez que lo escuches", "Repetir este tipo de cuestionarios cada mes para medir tu avance"],
      proximosPasos: ["Lee tu primer artículo del módulo educativo esta semana", "Haz el cuestionario de cómo administras tu dinero"],
      recursos: ["Artículo: conceptos financieros básicos explicados simple", "Cuestionario: ¿cómo administras tu dinero?"] },
    { min: 11, max: 17, perfil: "Aprendiz en marcha", emoji: "📘",
      descripcion: "Ya tienes nociones básicas sobre varios temas financieros importantes. Te falta profundizar en algunos conceptos clave para sentirte más seguro.",
      fortalezas: ["Tienes una base conceptual inicial", "Buscas aprender de vez en cuando por tu cuenta", "Identificas al menos las señales más obvias de riesgo"],
      areasMejora: ["El interés compuesto y el crédito aún no están del todo claros", "La búsqueda de aprendizaje podría ser más constante", "La seguridad para decisiones importantes todavía es limitada"],
      recomendaciones: ["Profundiza en un tema a la vez: primero crédito, luego interés compuesto", "Fija un ritmo de aprendizaje, por ejemplo un artículo cada semana", "Practica identificar señales de alerta revisando ejemplos reales en los artículos de BETA"],
      habitosSugeridos: ["Leer sobre un concepto financiero nuevo cada semana", "Comentar o compartir lo aprendido con alguien más para reforzarlo", "Aplicar lo aprendido en tus propios movimientos dentro de BETA"],
      proximosPasos: ["Elige un tema específico para profundizar esta semana", "Haz el cuestionario de cuál es tu personalidad financiera"],
      recursos: ["Artículo: crédito explicado para principiantes", "Cuestionario: ¿cuál es tu personalidad financiera?"] },
    { min: 18, max: 22, perfil: "Conocedor sólido", emoji: "📗",
      descripcion: "Tienes un buen dominio de los conceptos financieros esenciales y te sientes razonablemente preparado para tomar decisiones importantes.",
      fortalezas: ["Comprendes conceptos clave como presupuesto, crédito e interés compuesto", "Buscas aprender de forma activa", "Identificas bien las señales de riesgo comunes"],
      areasMejora: ["Podrías profundizar en temas más avanzados", "Vale la pena poner a prueba tu conocimiento en decisiones reales", "Comparte lo que sabes, puede ayudar a otros en tu equipo o comunidad"],
      recomendaciones: ["Explora artículos más avanzados sobre inversión o construcción de historial crediticio", "Usa tu conocimiento para tomar una decisión financiera real y consciente", "Considera explicarle a alguien más un concepto que domines bien, es la mejor forma de reforzarlo"],
      habitosSugeridos: ["Leer contenido un poco más avanzado cada semana", "Aplicar activamente lo aprendido en decisiones reales", "Enseñar o compartir un concepto financiero con alguien más"],
      proximosPasos: ["Lee un artículo de nivel avanzado esta semana", "Haz el cuestionario de qué tan cerca estás de tus metas financieras"],
      recursos: ["Artículo: primeros pasos hacia la inversión", "Cuestionario: ¿qué tan cerca estás de alcanzar tus metas financieras?"] },
    { min: 23, max: 24, perfil: "Referente financiero", emoji: "🎓",
      descripcion: "Tienes un nivel de educación financiera notable para tu edad. Entiendes los conceptos clave, aplicas lo aprendido y te sientes seguro tomando decisiones importantes.",
      fortalezas: ["Dominio sólido de conceptos financieros clave", "Aprendizaje constante y por iniciativa propia", "Buena capacidad para identificar riesgos y oportunidades"],
      areasMejora: ["Podrías explorar temas más especializados (inversión, impuestos)", "Vale la pena documentar y compartir tu conocimiento con más personas", "Sigue retándote con decisiones financieras más complejas"],
      recomendaciones: ["Explora temas especializados como fundamentos de inversión o fiscalidad básica", "Comparte lo que sabes con tu equipo o comunidad, refuerza tu propio aprendizaje", "Sigue completando cuestionarios y artículos para mantenerte actualizado"],
      habitosSugeridos: ["Explorar un tema financiero avanzado al mes", "Mentorear a alguien que esté empezando su educación financiera", "Revisar y actualizar tu conocimiento con nuevo contenido de BETA"],
      proximosPasos: ["Elige un tema avanzado para explorar este mes", "Comparte un aprendizaje financiero con alguien de tu equipo"],
      recursos: ["Artículo: fundamentos de inversión para jóvenes", "Módulo completo de Artículos en BETA"] },
  ],
};

export const CUESTIONARIOS: Cuestionario[] = [
  administracion,
  impulsividad,
  personalidad,
  emergencia,
  habitos,
  ahorro,
  decisiones,
  metas,
  educacion,
];

export function obtenerCuestionario(id: string): Cuestionario | undefined {
  return CUESTIONARIOS.find((c) => c.id === id);
}