/* ================= HELPERS ================= */
function out(id) {
  return document.getElementById(id);
}

function money(v, d = 0) {
  return "$ " + (d ? Number(v).toFixed(d) : Math.round(v));
}

/* ================= TABS ================= */
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {

      document.querySelectorAll(".tab").forEach(t =>
        t.classList.remove("active")
      );
      document.querySelectorAll(".tab-content").forEach(c =>
        c.classList.remove("active")
      );

      btn.classList.add("active");
      out(btn.dataset.tab).classList.add("active");
    });
  });

  calcularTarifas();
  calcularViajeLargo();
  calcularTaximetro();
});

/* ================= TARIFAS ================= */
function calcularTarifas() {

  const m = +out("millas").value || 0;
  const p = +out("paradas").value || 0;

  // paradas SOLO se suman al final
  let extraParadas = p === 1 ? 2 : p > 1 ? 2 + (p - 1) : 0;

  let base = m * 2 + 2;
  if (base < 6) base = 6;

  out("sin_descuento").textContent = money(base, 2);

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

  out("clasificacion").textContent = txt;
  out("descuento").textContent = txt;

  out("con_descuento").textContent =
    money(base * factor + extraParadas, 2);

  out("van").textContent =
    money((base < 8 ? 8 : base) * factor + extraParadas);

  out("trabajo").textContent =
    money(base * (base < 19.75 ? 0.8 : 0.75) + extraParadas);

  out("trabajo_van").textContent =
    money(base * (base < 19.75 ? 0.9 : 0.85) + extraParadas);

  out("delivery_comida").textContent =
    money((m <= 2.6 ? 12 : base * factor + 5) + extraParadas);

  out("delivery_alcohol").textContent =
    money((m <= 4.8 ? 17 : base * factor + 7) + extraParadas);

  out("objeto").textContent =
    money(Math.max(base * 0.75, 6));
}

/* ================= VIAJE LARGO ================= */
function calcularViajeLargo() {

  const h = +out("horas").value || 0;
  const min = +out("minutos").value || 0;

  const totalMin = h * 60 + min;
  const base = totalMin * 90 / 60;

  out("viaje_largo").textContent = money(base, 2);
  out("viaje_largo_rt").textContent = money(base * 2 * 0.75 + 2, 2);
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

  out("taximetro_valor").textContent = money(total, 2);
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

