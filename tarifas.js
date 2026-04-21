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
  const fecha = `${hoy.getDate()}/${hoy.getMonth()+1}/${String(hoy.getFullYear()).slice(2)}`;

  const resultado = 
`DESDE : ${origen}
HASTA : ${destino}
#71 DE $${trabajoValor} CON ${millas}M 

${unidad} ${fecha} AJUSTE`;

  out("resultado_servicio").value = resultado;
  // 🔥 actualizar texto automáticamente
generarServicio();
}


/* ================= TARIFAS ================= */
function calcularTarifas() {

  const m = +out("millas").value || 0;
  const p = +out("paradas").value || 0;

  const extraParadas = p === 1 ? 2 : p > 1 ? 2 + (p - 1) : 0;

  const valorReal = m * 2 + 2;
  const base = Math.max(valorReal, 6);

  setValue("sin_descuento", money(base + extraParadas, 2));

  /* ===== DESCUENTOS GENERALES ===== */

  let factor = 0.85;
  let txt = "15%";

  if (base >= 50 && base <= 99.75) {
    factor = 0.80;
    txt = "20%";
  }
  else if (base >= 100) {
    factor = 0.75;
    txt = "25%";
  }

  setValue("clasificacion", txt);
  setValue("descuento", txt);

  let conDescuentoBase = base * factor;

  if (conDescuentoBase < 6) conDescuentoBase = 6;

  setValue(
    "con_descuento",
    money(conDescuentoBase + extraParadas, 2)
  );

/* ===== TRABAJO ===== */

// definir factor propio de trabajo
let trabajoFactor = 0.85; // 15% por defecto

if (base >= 50 && base < 100) {
  trabajoFactor = 0.80; // 20%
} 
else if (base >= 100) {
  trabajoFactor = 0.75; // 25%
}

// calcular
let trabajoCalculado = base * trabajoFactor;

// mínimo $6
if (trabajoCalculado < 6) trabajoCalculado = 6;

// resultado final
setValue(
  "trabajo",
  money(Math.round(trabajoCalculado + extraParadas))
);

  /* ===== VAN ===== */

  const vanBase = Math.max(base, 8);

  let vanFactor = 0.95;

  if (base >= 30 && base <= 49.75) {
    vanFactor = 0.90;
  }
  else if (base >= 50 && base <= 99.75) {
    vanFactor = 0.85;
  }
  else if (base >= 100) {
    vanFactor = 0.80;
  }

  const vanFinal =
    vanBase === 8
      ? 8 + extraParadas
      : vanBase * vanFactor + extraParadas;

  setValue("van", money(vanFinal));

  /* ===== TRABAJO VAN ===== */

  const trabajoVanBase = Math.max(base, 8);

  let trabajoVanFactor = 1;

  if (base >= 30 && base <= 49.75) {
    trabajoVanFactor = 0.90;
  }
  else if (base >= 50 && base <= 99.75) {
    trabajoVanFactor = 0.85;
  }
  else if (base >= 100) {
    trabajoVanFactor = 0.80;
  }

  const trabajoVanFinal =
    trabajoVanBase === 8
      ? 8 + extraParadas
      : trabajoVanBase * trabajoVanFactor + extraParadas;

  setValue("trabajo_van", money(trabajoVanFinal));

  /* ===== DELIVERY COMIDA ===== */

  setValue(
    "delivery_comida",
    money(Math.max((m <= 2.6 ? 12 : base * factor + 5) + extraParadas, 12))
  );

  /* ===== DELIVERY ALCOHOL ===== */

  setValue(
    "delivery_alcohol",
    money(Math.max((m <= 4.8 ? 17 : base * factor + 7) + extraParadas, 17))
  );

  /* ===== OBJETO PERDIDO ===== */

  setValue(
    "objeto",
    money(Math.max(base * 0.75, 6) + extraParadas)
  );

  /* ===== PICK UP ===== */

  setValue(
    "servicio_pickup",
    money(base + 20 + extraParadas)
  );

  /* ===== MASCOTA ===== */

  let baseMascota = base * factor;

  if (baseMascota < 6) baseMascota = 6;

  setValue(
    "mascota",
    money(Math.round(baseMascota + 4 + extraParadas))
  );

  /* ===== CABLE AUXILIAR ===== */

  const tarifaConDescuentoBase =
    valorReal <= 6
      ? 6
      : valorReal * factor;

  let cableBase = Math.max(tarifaConDescuentoBase, 10);

setValue(
  "cable_auxiliar",
  money(Math.round(cableBase + extraParadas))
);

// 🔥 actualizar texto automáticamente
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
calcularTaximetro();
