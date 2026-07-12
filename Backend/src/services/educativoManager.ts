import Articulo from "../models/Articulo";

export default class EducativoManager {
    private articulos: Articulo[] = [];

    constructor() {
        this.articulos.push(
            new Articulo(
                1,
                "Cómo ahorrar tu primera quincena sin sufrir en el intento",
                `Recibir tu primera quincena es una sensación única: por fin ese dinero es tuyo. El problema es que, sin un plan, también desaparece rápido entre antojos, salidas y gastos que ni siquiera recuerdas al final del mes.

La clave no está en ganar más, sino en decidir qué hacer con el dinero antes de gastarlo. A esto se le conoce como "pagarte a ti mismo primero": en cuanto recibas tu quincena, aparta un porcentaje fijo, aunque sea el 10%, antes de cubrir cualquier otro gasto. Ese dinero se mueve a una cuenta separada o a un espacio donde no lo veas todos los días.

Empieza con una meta pequeña y alcanzable. Ahorrar $200 pesos por quincena no cambia tu estilo de vida, pero en seis meses ya tienes $2,400 pesos que antes no existían. Lo importante no es el monto, es la constancia: el hábito se construye repitiendo la acción, no haciéndola perfecta.

Un truco que funciona muy bien es automatizar el ahorro. Si tu banco permite transferencias programadas, configura una para el mismo día en que te pagan, así el ahorro ocurre antes de que tengas oportunidad de gastarlo.

Por último, evita mezclar tu dinero de ahorro con tu dinero del día a día. Cuando ambos están en la misma cuenta es fácil convencerte de que "solo por esta vez" puedes tomar prestado del ahorro. Sepáralos y trátalos como si fueran de personas distintas.`,
                "02-06-2026",
                "Ahorro",
                "Aragon Ku",
                "Ahorrar no depende de ganar más, depende de decidir primero. Un método simple para separar dinero desde el primer depósito.",
                4,
                ["ahorro", "primer sueldo", "hábitos"],
                false
            ),
            new Articulo(
                2,
                "La regla 50/30/20: un presupuesto que sí puedes seguir",
                `La palabra "presupuesto" suena a algo aburrido, lleno de números y restricciones. Pero en el fondo un presupuesto es solo un plan: le dice a tu dinero a dónde ir, en lugar de preguntarte a dónde se fue.

La regla 50/30/20 es una de las formas más sencillas de empezar. Divide tus ingresos mensuales en tres bloques: 50% para necesidades (renta, comida, transporte, servicios), 30% para gustos (salidas, streaming, ropa) y 20% para tu futuro (ahorro y pago de deudas).

No necesitas una aplicación sofisticada para aplicarla. Basta con anotar tus ingresos del mes y repartirlos en esos tres sobres, físicos o digitales. Lo importante es que cada peso tenga un destino asignado antes de gastarlo, no después.

Si tus necesidades básicas superan el 50%, no te frustres: es una guía, no una ley. El objetivo real es tener consciencia de en qué se va tu dinero y encontrar, poco a poco, espacio para ajustar los porcentajes a tu favor.

Revisa tu presupuesto cada quincena, no solo al final del mes. Los ajustes pequeños y frecuentes evitan sorpresas grandes cuando llega la fecha de pago.`,
                "10-06-2026",
                "Presupuesto",
                "Aragon Ku",
                "Un presupuesto no tiene que ser una hoja de cálculo complicada. Con tres categorías puedes organizar tu dinero desde hoy.",
                4,
                ["presupuesto", "organización", "50-30-20"],
                false
            ),
            new Articulo(
                3,
                "Invertir con poco dinero: por dónde empezar en 2026",
                `Durante mucho tiempo se pensó que invertir era solo para personas con mucho dinero o mucho conocimiento financiero. Hoy eso cambió: existen instrumentos que permiten empezar a invertir con montos pequeños y aprender sobre la marcha.

Antes de invertir un solo peso, asegúrate de tener un fondo de emergencia equivalente a al menos tres meses de tus gastos básicos. Invertir dinero que podrías necesitar mañana es la forma más rápida de tomar malas decisiones bajo presión.

Existen distintos niveles de riesgo. El primer escalón suele ser el CETE, que es de bajo riesgo y puedes comprar desde $100 pesos directamente con el gobierno. Un escalón más arriba están los fondos indexados, que reparten tu dinero entre muchas empresas a la vez, reduciendo el riesgo de depender de una sola.

Una regla que rara vez falla: si no entiendes cómo un instrumento genera rendimiento, no inviertas en él todavía. Tómate el tiempo de investigar antes de mover tu dinero, sin importar cuán atractiva suene la promesa de ganancias rápidas.

Por último, piensa en la inversión como una carrera larga, no una de velocidad. El interés compuesto favorece a quien empieza antes, aunque sea con poco, sobre quien espera a tener "suficiente" dinero para comenzar.`,
                "18-06-2026",
                "Inversión",
                "Aragon Ku",
                "No necesitas miles de pesos ni ser experto en la bolsa. Las bases para dar tus primeros pasos como inversionista.",
                5,
                ["inversión", "cetes", "fondos indexados"],
                false
            ),
            new Articulo(
                4,
                "Tarjeta de crédito: tu primera y cómo no arruinarte con ella",
                `Tener tu primera tarjeta de crédito se siente como un logro, y lo es. Pero también es una de las herramientas financieras que más rápido puede meterte en problemas si no entiendes cómo funciona realmente.

La regla más importante es simple de decir y difícil de cumplir: paga el total de tu deuda cada mes, no solo el pago mínimo. El pago mínimo existe para que el banco gane intereses, no para que tú salgas beneficiado.

Usa la tarjeta como si fuera dinero que ya tienes, no dinero que vas a tener. Antes de comprar algo, pregúntate si podrías pagarlo hoy mismo con el saldo de tu cuenta de débito. Si la respuesta es no, probablemente no deberías cargarlo a la tarjeta.

Aprovecha la tarjeta a tu favor construyendo historial crediticio: paga siempre a tiempo y mantén tu uso por debajo del 30% de tu límite. Esto te abrirá puertas más adelante, como créditos con mejores condiciones para un auto o una casa.

Finalmente, revisa tu estado de cuenta cada mes, no solo el monto a pagar. Ahí puedes detectar cargos que no reconoces, comisiones evitables y entender exactamente en qué se te está yendo el dinero.`,
                "25-06-2026",
                "Tarjetas de crédito",
                "Equipo BETA",
                "Una tarjeta de crédito puede ser una herramienta poderosa o una trampa costosa. Depende de cómo la uses desde el primer mes.",
                4,
                ["tarjetas", "crédito", "deuda"],
                false
            ),
            new Articulo(
                5,
                "Interés compuesto explicado sin fórmulas complicadas",
                `Se suele decir que el interés compuesto es la fuerza más poderosa en las finanzas personales, y no es exagerado: describe algo muy real, el dinero que gana dinero, que a su vez gana más dinero.

Imagina que ahorras $1,000 pesos con un rendimiento del 10% anual. Al final del primer año tienes $1,100. Pero en el segundo año ese 10% ya no se calcula sobre $1,000, sino sobre $1,100, así que ganas $110, no $100. Parece poco, pero con el tiempo esa diferencia se vuelve enorme.

La variable más importante en el interés compuesto no es cuánto dinero metes, es cuánto tiempo lo dejas trabajar. Alguien que invierte $500 pesos mensuales desde los 20 años puede terminar con más dinero a los 60 que alguien que invierte el doble empezando a los 35, simplemente por la ventaja del tiempo.

Este mismo principio funciona en tu contra cuando hablamos de deudas. Los intereses de una tarjeta de crédito o un préstamo también se acumulan de forma compuesta, por lo que una deuda pequeña sin pagar puede crecer mucho más rápido de lo que imaginas.

Entender esto cambia la forma en la que ves cada decisión financiera: empezar hoy, aunque sea con poco, vale más que esperar a tener "lo suficiente" para empezar mañana.`,
                "01-07-2026",
                "Educación financiera",
                "Aragon Ku",
                "Es el concepto financiero más poderoso que existe, y también uno de los más malentendidos. Va sin fórmulas, con ejemplos simples.",
                5,
                ["interés compuesto", "conceptos", "largo plazo"],
                false
            ),
            new Articulo(
                6,
                "De la idea al primer cliente: finanzas para emprendedores novatos",
                `Emprender es emocionante, pero también es de las decisiones financieras más riesgosas que puedes tomar si no organizas bien tu dinero desde el inicio. El primer error común de quien empieza un negocio es mezclar sus finanzas personales con las del emprendimiento.

Abre una cuenta separada exclusivamente para tu negocio, aunque sea pequeño. Todo lo que entra por ventas va ahí, y todo lo que sale para gastos del negocio también sale de ahí. Esto te permite saber, con claridad, si realmente estás ganando dinero o solo moviendo el mismo dinero de un lado a otro.

Antes de fijar tus precios, calcula todos tus costos: materiales, tiempo, transporte, comisiones de plataformas de pago. Muchos emprendimientos jóvenes fracasan no porque no tengan clientes, sino porque cobran menos de lo que realmente cuesta producir lo que venden.

Reinvierte con cabeza fría. Es tentador gastar las primeras ganancias en algo llamativo, pero es más inteligente destinar una parte a hacer crecer el negocio y otra a un colchón de emergencia.

Por último, ponte un sueldo, aunque sea simbólico. Trabajar "gratis" para tu propio negocio te impide medir si realmente es rentable o si solo está sobreviviendo gracias a tu esfuerzo no pagado.`,
                "05-07-2026",
                "Emprendimiento",
                "Marcos Martín",
                "Antes de pensar en hacerte rico con tu negocio, necesitas separar tus finanzas personales de las del emprendimiento.",
                5,
                ["emprendimiento", "negocio propio", "precios"],
                false
            ),
            new Articulo(
                7,
                "Metas financieras SMART: cómo ponerle fecha a tus sueños",
                `Decir "quiero ahorrar más" o "quiero mejorar mis finanzas" se siente bien, pero rara vez se convierte en acción real. Sin un número y una fecha, cualquier meta financiera se queda en intención.

El método SMART ayuda a poner estructura a tus objetivos: específicos, medibles, alcanzables, relevantes y con tiempo definido. En lugar de "quiero ahorrar para un viaje", la versión SMART sería: "quiero ahorrar $6,000 pesos para un viaje en diciembre, apartando $500 pesos cada quincena".

Divide metas grandes en metas pequeñas. Si tu objetivo es juntar $24,000 pesos en un año, eso equivale a $2,000 pesos al mes, o aproximadamente $67 pesos al día. Ver la meta en su versión diaria la hace sentir mucho más alcanzable.

Ten metas de distintos plazos al mismo tiempo: una a corto plazo, una a mediano plazo y una a largo plazo. Esto te da motivación constante, porque siempre hay una meta cerca de cumplirse.

Revisa tus metas cada mes y ajústalas si es necesario. No son promesas grabadas en piedra, son herramientas que deben adaptarse a lo que realmente está pasando en tu vida.`,
                "08-07-2026",
                "Metas financieras",
                "Nikte Hernández",
                `"Quiero ahorrar más" no es una meta, es un deseo. Aprende a convertir tus objetivos financieros en planes concretos.`,
                4,
                ["metas", "planeación", "smart"],
                false
            ),
            new Articulo(
                8,
                "5 errores financieros que casi todos cometemos antes de los 25",
                `Nadie nos enseña a manejar el dinero en la escuela, así que la mayoría aprendemos a base de errores. Conocer los más comunes antes de cometerlos puede ahorrarte tiempo, estrés y mucho dinero.

El primero es no llevar ningún registro de gastos. Sin saber a dónde se va el dinero, es imposible tomar decisiones informadas. No se trata de anotar cada peso de forma obsesiva, sino de tener una idea clara de tus patrones de gasto.

El segundo es usar el crédito como si fuera un ingreso extra. Una tarjeta de crédito no aumenta tu dinero disponible, solo adelanta gastos futuros con un costo adicional si no se paga a tiempo.

El tercero es no tener ningún fondo de emergencia. Sin un colchón financiero, cualquier imprevisto termina resuelto con deuda, generando un ciclo difícil de romper.

El cuarto es comparar tu situación financiera con la de otras personas en redes sociales, tomando decisiones de gasto basadas en una imagen que rara vez muestra la realidad completa.

El quinto, y quizás el más silencioso, es posponer el ahorro y la inversión "para cuando gane más". Los hábitos financieros se construyen con la cantidad que tengas hoy, no con la que imaginas tener en el futuro.`,
                "11-07-2026",
                "Errores comunes",
                "Aragon Ku",
                "Nadie nace sabiendo manejar el dinero. Conocer estos errores comunes te puede ahorrar años de dolores de cabeza financieros.",
                6,
                ["errores comunes", "hábitos", "primeros pasos"],
                true
            )
        );
    }

    obtenerArticulos(): Articulo[] {
        return this.articulos;
    }

    agregarArticulo(articulo: Articulo): void {
        this.articulos.push(articulo);
    }
}