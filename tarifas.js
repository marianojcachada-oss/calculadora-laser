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
  void el.offsetWidth; // reflow
  el.classList.add("value-animate");
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

/* ================= TARIFAS ================= */
function calcularTarifas() {

  const m = +out("millas").value || 0;
  const p = +out("paradas").value || 0;

  // paradas SOLO al final
  const extraParadas = p === 1 ? 2 : p > 1 ? 2 + (p - 1) : 0;

  const valorReal = m * 2 + 2;
  const base = Math.max(valorReal, 6);


  setValue(
  "sin_descuento",
  money(base + extraParadas, 2)
  );


  let factor = 0.9;
  let txt = "10%";

  if (base >= 19.76 && base <= 29.75) {
    factor = 0.85;
    txt = "15%";
  } else if (base >= 29.76 && base < 40) {
    factor = 0.8;
    txt = "20%";
  } else if (base >= 40) {
    factor = 0.75;
    txt = "25%";
  }

  setValue("clasificacion", txt);
  setValue("descuento", txt);

let conDescuentoBase = base * factor;

// mínimo absoluto
if (conDescuentoBase < 6) conDescuentoBase = 6;

setValue(
  "con_descuento",
  money(conDescuentoBase + extraParadas, 2)
);



  /* ===== Servicios especiales (con mínimos) ===== */

/* ===== VAN ===== */

// base VAN mínima
const vanBase = Math.max(base, 8);

// descuento VAN según tarifa sin descuento
let vanFactor = 1;

if (base >= 19.76 && base <= 39.75) {
  vanFactor = 0.9;   // 10%
} else if (base >= 39.76) {
  vanFactor = 0.85;  // 15%
}

const vanFinal =
  vanBase === 8
    ? 8 + extraParadas
    : vanBase * vanFactor + extraParadas;

setValue("van", money(vanFinal));

/* ===== TRABAJO ===== */

// mínimo base
const trabajoBase = Math.max(base, 6);

// descuento según tarifa sin descuento
let trabajoFactor = base < 19.75 ? 0.8 : 0.75;

// si queda en mínimo, NO se descuenta
let trabajoCalculado = base * trabajoFactor;

if (trabajoCalculado < 6) trabajoCalculado = 6;

setValue(
  "trabajo",
  money(trabajoCalculado + extraParadas, 2)
);

/* ===== TRABAJO VAN ===== */

// mínimo base
const trabajoVanBase = Math.max(base, 8);

// descuento según tarifa sin descuento
let trabajoVanFactor = base < 19.75 ? 0.9 : 0.85;

// si queda en mínimo, NO se descuenta
const trabajoVanFinal =
  trabajoVanBase === 8
    ? 8 + extraParadas
    : trabajoVanBase * trabajoVanFactor + extraParadas;

setValue("trabajo_van", money(trabajoVanFinal));


  // Delivery comida mínimo 12
  setValue(
    "delivery_comida",
    money(Math.max((m <= 2.6 ? 12 : base * factor + 5) + extraParadas, 12))
  );

  // Delivery alcohol mínimo 17
  setValue(
    "delivery_alcohol",
    money(Math.max((m <= 4.8 ? 17 : base * factor + 7) + extraParadas, 17))
  );

  // Objeto perdido mínimo 6
  setValue(
  "objeto",
  money(Math.max(base * 0.75, 6) + extraParadas)
  );
  
/* ===== SERVICIO PICK UP 🚚 ===== */
setValue(
  "servicio_pickup",
  money(base + 20 + extraParadas)
);

/* ===== SERVICIO CON MASCOTA 🐕 ===== */

// 1️⃣ tarifa con descuento
let baseMascota = base * factor;

// 2️⃣ mínimo $6
if (baseMascota < 6) baseMascota = 6;

// 3️⃣ sumar extra mascota (+$4)
// 4️⃣ sumar paradas al final
setValue(
  "mascota",
  money(baseMascota + 4 + extraParadas, 2)
);


/* ===== SERVICIO CABLE AUXILIAR 🔌 ===== */
setValue(
  "cable_auxiliar",
  money(Math.max(base * factor, 10) + extraParadas, 2)
);
}

/* ================= VIAJE LARGO ================= */
function calcularViajeLargo() {

  const h = +out("horas").value || 0;
  const min = +out("minutos").value || 0;

  const totalMin = h * 60 + min;
  const base = totalMin * 90 / 60;

  setValue("viaje_largo", money(base, 2));
  setValue("viaje_largo_rt", money(base * 2 * 0.75 + 2, 2));
}

/* ================= TAXIMETRO ================= */
function calcularTaximetro() {

  const m = +out("millas_taximetro").value || 0;
  const hi = +out("hora_inicio").value || 0;
  const mi = +out("min_inicio").value || 0;
  const hf = +out("hora_fin").value || 0;
  const mf = +out("min_fin").value || 0;

  let base = 2;
  let distancia = Math.max(0, (m * 1760 - 50) / 260) * 0.25;
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
["millas", "paradas"].forEach(id =>
  out(id).addEventListener("input", calcularTarifas)
);

["horas", "minutos"].forEach(id =>
  out(id).addEventListener("input", calcularViajeLargo)
);

[
  "millas_taximetro",
  "hora_inicio",
  "min_inicio",
  "hora_fin",
  "min_fin"
].forEach(id =>
  out(id).addEventListener("input", calcularTaximetro)
);

/* ================= INIT ================= */
calcularTarifas();
calcularViajeLargo();
calcularTaximetro();

