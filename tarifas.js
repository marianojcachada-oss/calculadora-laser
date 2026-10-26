/* ================= CONFIGURACIÓN (TARIFARIO TAXI LASER) ================= */

// Hora de referencia: Atlanta
const ZONA_HORARIA = "America/New_York";

// Descuento único del tarifario (solo en los horarios que lo permiten)
const ESCALAS_TARIFA = [
  { desde: 0, factor: 0.90, txt: "10%" }
];

// Van: mínima $8; menos de $29.75 sin descuento; igual o mayor a $30, 10% de descuento
const VAN_MINIMA = 8;
const ESCALAS_VAN = [
  { desde: 30, factor: 0.90 },
  { desde: 0,  factor: 1 }
];

// Sitio nocturno (bares y discotecas)
const MINIMA_SITIO_NOCTURNO = 15;

// Extra por carga grande o mudanza (SUV, Van o Truck)
const EXTRA_CARGA_MIN = 10;
const EXTRA_CARGA_MAX = 30;

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/* ================= HELPERS ================= */
function out(id) {
  return document.getElementById(id);
}

function money(v, d = 0) {
  return "$ " + (d ? Number(v).toFixed(d) : Math.round(v));
}

/* Animación de valores */
function setValue(id, value) {
  const el = out(id);
  if (!el) return;
  el.textContent = value;
  el.classList.remove("value-animate");
  void el.offsetWidth;
  el.classList.add("value-animate");
}

function escala(tabla, monto) {
  return tabla.find(e => monto >= e.desde);
}

function minutos(h, m) {
  return h * 60 + m;
}

function enRango(min, desdeH, desdeM, hastaH, hastaM) {
  return min >= minutos(desdeH, desdeM) && min <= minutos(hastaH, hastaM);
}

/* ================= DÍA Y HORA DEL SERVICIO ================= */

// Día (0 = domingo) y hora actuales en Atlanta
function ahoraEnAtlanta() {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA_HORARIA,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());

  const get = tipo => partes.find(p => p.type === tipo).value;
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));

  return { dia, hora: +get("hour"), min: +get("minute") };
}

// Completa día y hora con el momento actual si los campos existen y están vacíos
function cargarAhora() {
  const ahora = ahoraEnAtlanta();
  const dia = out("dia_servicio");
  const hora = out("hora_servicio");

  if (dia) dia.value = String(ahora.dia);
  if (hora) {
    hora.value =
      String(ahora.hora).padStart(2, "0") + ":" + String(ahora.min).padStart(2, "0");
  }
}

// Lee el día y la hora elegidos; si faltan los campos, usa la hora actual de Atlanta
function leerMomento() {
  const ahora = ahoraEnAtlanta();
  const diaEl = out("dia_servicio");
  const horaEl = out("hora_servicio");

  const dia = diaEl && diaEl.value !== "" ? +diaEl.value : ahora.dia;

  let hora = ahora.hora;
  let min = ahora.min;
  if (horaEl && horaEl.value) {
    const [h, m] = horaEl.value.split(":");
    hora = +h;
    min = +m;
  }

  return { dia, hora, min };
}

/*
  Reglas de cobro del tarifario según día y horario.
  descuento: "si"     → se aplica descuento
             "desde20" → solo a servicios de $20 en adelante
             "no"     → sin descuento
  nocturno:  true si corresponde la mínima de sitio nocturno (bares y discotecas)
  dias / franja: días y horario en que vale la regla (para el texto del servicio)
  franjaNocturna: horario del sitio nocturno, cuando corresponde
*/
function reglasHorario(dia, hora, min) {
  const t = minutos(hora, min);
  const madrugada = enRango(t, 0, 0, 5, 59);
  const noche = enRango(t, 22, 0, 23, 59);

  const MADRUGADA = "12:00 AM A 5:59 AM";
  const NOCHE = "10:00 PM A 11:59 PM";

  // Lunes a viernes
  if (dia >= 1 && dia <= 5) {
    const dias = "LUNES A VIERNES";
    if (madrugada) {
      return {
        minima: 8,
        descuento: "no",
        nocturno: dia === 1 && enRango(t, 1, 0, 2, 59),
        dias,
        franja: MADRUGADA,
        diasNocturno: "LUNES",
        franjaNocturna: "1:00 AM A 2:59 AM"
      };
    }
    if (noche) return { minima: 6, descuento: "no", nocturno: false, dias, franja: NOCHE };
    return { minima: 6, descuento: "si", nocturno: false, dias, franja: "6:00 AM A 9:59 PM" };
  }

  // Sábado
  if (dia === 6) {
    const dias = "SÁBADO";
    if (madrugada) {
      return {
        minima: 8,
        descuento: "no",
        nocturno: enRango(t, 2, 0, 3, 59),
        dias,
        franja: MADRUGADA,
        diasNocturno: dias,
        franjaNocturna: "2:00 AM A 3:59 AM"
      };
    }
    if (enRango(t, 6, 0, 18, 59)) {
      return { minima: 6, descuento: "si", nocturno: false, dias, franja: "6:00 AM A 6:59 PM" };
    }
    if (enRango(t, 19, 0, 21, 59)) {
      return { minima: 6, descuento: "desde20", nocturno: false, dias, franja: "7:00 PM A 9:59 PM" };
    }
    return { minima: 6, descuento: "no", nocturno: false, dias, franja: NOCHE };
  }

  // Domingo
  const dias = "DOMINGO";
  if (madrugada) {
    return {
      minima: 8,
      descuento: "no",
      nocturno: enRango(t, 2, 0, 3, 59),
      dias,
      franja: MADRUGADA,
      diasNocturno: dias,
      franjaNocturna: "2:00 AM A 3:59 AM"
    };
  }
  if (noche) return { minima: 6, descuento: "no", nocturno: false, dias, franja: NOCHE };
  return { minima: 6, descuento: "desde20", nocturno: false, dias, franja: "6:00 AM A 9:59 PM" };
}

// Última regla calculada, para armar el texto del servicio
let ultimaRegla = null;

function textoRegla(momento, regla, sitioNocturno) {
  const hora =
    String(momento.hora).padStart(2, "0") + ":" + String(momento.min).padStart(2, "0");

  let detalle;
  if (sitioNocturno) {
    detalle = `mínima $${MINIMA_SITIO_NOCTURNO} (sitio nocturno), sin descuento`;
  } else if (regla.descuento === "si") {
    detalle = `mínima $${regla.minima}, con descuento`;
  } else if (regla.descuento === "desde20") {
    detalle = `mínima $${regla.minima}, descuento solo desde $20`;
  } else {
    detalle = `mínima $${regla.minima}, sin descuento`;
  }

  return `${DIAS[momento.dia]} ${hora} · ${detalle}`;
}

/* ================= TABS ================= */
document.addEventListener("DOMContentLoaded", () => {

  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {

      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      out(tab.dataset.tab).classList.add("active");
    });
  });

});

/* ================= TEXTO DEL SERVICIO ================= */
function generarServicio() {

  const origen = out("origen")?.value || "";
  const destino = out("destino")?.value || "";
  const unidad = out("unidad")?.value || "";

  const millas = +out("millas").value || 0;

  // tomar valor de trabajo ya calculado
  const trabajoTexto = out("trabajo")?.textContent || "$ 0";

  // limpiar formato "$ "
  const trabajoValor = trabajoTexto.replace("$ ", "");

  // fecha automática
  const hoy = new Date();
  const fecha = `${hoy.getDate()}/${hoy.getMonth() + 1}/${String(hoy.getFullYear()).slice(2)}`;

  const resultado =
`>>>TARIFA DE TRABAJO<<<
ORIGEN : ${origen}
DESTINO : ${destino}
#71 DE $${trabajoValor} CON ${millas}M

${unidad} ${fecha} DE CREACIÓN`;

  const destinoTexto = out("resultado_servicio");
  if (destinoTexto) destinoTexto.value = resultado;
}

/* ================= TARIFAS ================= */
function calcularTarifas() {

  const m = +out("millas").value || 0;
  const p = +out("paradas").value || 0;

  const extraParadas = p === 1 ? 2 : p > 1 ? 2 + (p - 1) : 0;

  // Extra por carga grande o mudanza: entre $10 y $30 (0 = sin extra)
  let extraCarga = +out("extra_carga")?.value || 0;
  if (extraCarga > 0) {
    extraCarga = Math.min(Math.max(extraCarga, EXTRA_CARGA_MIN), EXTRA_CARGA_MAX);
  }

  const valorReal = m * 2 + 2;

  /* ===== REGLAS POR DÍA Y HORARIO ===== */

  const momento = leerMomento();
  const regla = reglasHorario(momento.dia, momento.hora, momento.min);
  const sitioNocturno = regla.nocturno && !!out("sitio_nocturno")?.checked;

  const minima = sitioNocturno ? MINIMA_SITIO_NOCTURNO : regla.minima;
  const base = Math.max(valorReal, minima);

  let aplicaDescuento = !sitioNocturno && regla.descuento !== "no";
  if (regla.descuento === "desde20" && base < 20) aplicaDescuento = false;

  const esc = escala(ESCALAS_TARIFA, base);
  const factor = aplicaDescuento ? esc.factor : 1;
  const txt = aplicaDescuento ? esc.txt : "Sin descuento";

  ultimaRegla = { regla, sitioNocturno, aplicaDescuento };

  setValue("regla_horario", textoRegla(momento, regla, sitioNocturno));
  setValue("clasificacion", txt);
  setValue("descuento", txt);

  /* ===== TARIFA ===== */

  setValue("sin_descuento", money(base + extraParadas + extraCarga, 2));

  const conDescuentoBase = Math.max(base * factor, minima);

  setValue(
    "con_descuento",
    money(conDescuentoBase + extraParadas + extraCarga, 2)
  );

  /* ===== TRABAJO ===== */

  setValue(
    "trabajo",
    money(Math.round(conDescuentoBase + extraParadas + extraCarga))
  );

  /* ===== VAN Y TRABAJO VAN ===== */

  const vanBase = Math.max(valorReal, VAN_MINIMA);
  const vanFinal = vanBase * escala(ESCALAS_VAN, vanBase).factor + extraParadas + extraCarga;

  setValue("van", money(vanFinal));
  setValue("trabajo_van", money(vanFinal));

  /* ===== SERVICIOS QUE NO CUBRE EL TARIFARIO (sin cambios) ===== */

  const baseGeneral = Math.max(valorReal, 6);

  /* ===== DELIVERY COMIDA ===== */

  setValue(
    "delivery_comida",
    money(Math.max((m <= 2.6 ? 12 : baseGeneral * factor + 5) + extraParadas, 12))
  );

  /* ===== DELIVERY ALCOHOL ===== */

  setValue(
    "delivery_alcohol",
    money(Math.max((m <= 4.8 ? 17 : baseGeneral * factor + 7) + extraParadas, 17))
  );

  /* ===== OBJETO PERDIDO (10% de descuento, según horario) ===== */

  setValue(
    "objeto",
    money(Math.max(Math.max(valorReal, regla.minima) * factor, regla.minima) + extraParadas)
  );

  /* ===== PICK UP ===== */

  setValue(
    "servicio_pickup",
    money(baseGeneral + 20 + extraParadas)
  );

  /* ===== MASCOTA ===== */

  setValue(
    "mascota",
    money(Math.round(conDescuentoBase + 4 + extraParadas))
  );

  /* ===== CABLE AUXILIAR ===== */

  setValue(
    "cable_auxiliar",
    money(Math.round(Math.max(conDescuentoBase, 10) + extraParadas))
  );

  // actualizar texto automáticamente
  generarServicio();
}

/* ================= TAXIMETRO ================= */
function calcularTaximetro() {

  const m = +out("millas_taximetro").value || 0;
  const hi = +out("hora_inicio").value || 0;
  const mi = +out("min_inicio").value || 0;
  const hf = +out("hora_fin").value || 0;
  const mf = +out("min_fin").value || 0;

  let base = 2;

  let distancia = Math.max(0, (m * 1760 - 50) / 252) * 0.25;

  let tiempo = Math.max(
    0,
    ((hf * 60 + mf) - (hi * 60 + mi)) * 60 / 50
  ) * 0.25;

  let total = base + distancia + tiempo;

  const d = total % 1;

  total = Math.floor(total) +
    (d <= 0.125 ? 0 :
     d < 0.375 ? 0.25 :
     d < 0.625 ? 0.5 :
     d < 0.875 ? 0.75 : 1);

  setValue("taximetro_valor", money(total, 2));
}

/* ================= LISTENERS ================= */

["millas", "paradas", "extra_carga", "dia_servicio", "hora_servicio", "sitio_nocturno"]
  .forEach(id => {
    const el = out(id);
    if (!el) return;
    el.addEventListener("input", calcularTarifas);
    el.addEventListener("change", calcularTarifas);
  });

["origen", "destino", "unidad"].forEach(id => {
  const el = out(id);
  if (el) el.addEventListener("input", generarServicio);
});

out("usar_ahora")?.addEventListener("click", () => {
  cargarAhora();
  calcularTarifas();
});

[
  "millas_taximetro",
  "hora_inicio",
  "min_inicio",
  "hora_fin",
  "min_fin"
].forEach(id =>
  out(id).addEventListener("input", calcularTaximetro)
);

/* ================= RELOJ DE ATLANTA ================= */

// Usa el elemento #hora_atlanta si existe; si no, crea un reloj fijo arriba a la derecha
function iniciarRelojAtlanta() {
  let reloj = out("hora_atlanta");

  if (!reloj) {
    reloj = document.createElement("div");
    reloj.id = "hora_atlanta";
    reloj.style.cssText =
      "position:fixed;top:12px;right:12px;z-index:1000;" +
      "padding:6px 12px;border-radius:8px;" +
      "background:rgba(0,0,0,.75);color:#fff;" +
      "font:600 14px/1.2 system-ui,sans-serif;" +
      "font-variant-numeric:tabular-nums;";
    document.body.appendChild(reloj);
  }

  const formato = new Intl.DateTimeFormat("es-AR", {
    timeZone: ZONA_HORARIA,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const actualizar = () => {
    const texto = formato.format(new Date());
    reloj.textContent = "Atlanta: " + texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  actualizar();
  setInterval(actualizar, 1000);
}

/* ================= INIT ================= */

if (document.body) {
  iniciarRelojAtlanta();
} else {
  document.addEventListener("DOMContentLoaded", iniciarRelojAtlanta);
}

cargarAhora();
calcularTarifas();
calcularTaximetro();
