function out(id){ return document.getElementById(id); }

/* ================= TABS ================= */
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab, .tab-content").forEach(el => el.classList.remove("active"));
    btn.classList.add("active");
    out(btn.dataset.tab).classList.add("active");
  };
});

/* ================= HELPERS ================= */
function money(v, d=0){ return "$ " + (d ? v.toFixed(d) : Math.round(v)); }

/* ================= TARIFAS ================= */
function calcularTarifas(){
  const m = +out("millas").value || 0;
  const p = +out("paradas").value || 0;

  let paradas = p === 1 ? 2 : p > 1 ? 2 + (p - 1) : 0;

  let base = m * 2 + 2;
  if (base < 6) base = 6;

  out("sin_descuento").textContent = money(base + paradas,2);

  let factor = 0.9, txt="10%";
  if (base >= 19.76 && base <= 29.75){ factor = 0.85; txt="15%"; }
  else if (base < 40){ factor = 0.8; txt="20%"; }
  else { factor = 0.75; txt="25%"; }

  out("clasificacion").textContent = txt;
  out("descuento").textContent = txt;
  out("con_descuento").textContent = money(base*factor + paradas,2);

  out("van").textContent = money(Math.round((base<8?8:base)*factor + paradas));
  out("trabajo").textContent = money(Math.round(base*(base<19.75?0.8:0.75) + paradas));
  out("trabajo_van").textContent = money(Math.round(base*(base<19.75?0.9:0.85) + paradas));

  out("delivery_comida").textContent = money((m<=2.6?12:(base*factor+5))+paradas);
  out("delivery_alcohol").textContent = money((m<=4.8?17:(base*factor+7))+paradas);

  out("objeto").textContent = money(Math.max(base*0.75,6));
}

/* ================= VIAJE LARGO ================= */
function calcularViajeLargo(){
  const h = +out("horas").value || 0;
  const min = +out("minutos").value || 0;
  const total = h*60+min;
  out("viaje_largo").textContent = money(total*90/60,2);
  out("viaje_largo_rt").textContent = money((total*90/60)*2*0.75+2,2);
}

/* ================= TAXIMETRO ================= */
function calcularTaximetro(){
  const m = +out("millas_taximetro").value || 0;
  const hi = +out("hora_inicio").value || 0;
  const mi = +out("min_inicio").value || 0;
  const hf = +out("hora_fin").value || 0;
  const mf = +out("min_fin").value || 0;

  let base = 2;
  let dist = Math.max(0,(m*1760-50)/260)*0.25;
  let time = Math.max(0,((hf*60+mf)-(hi*60+mi))*60/50)*0.25;
  let t = base+dist+time;

  const d=t%1;
  t=Math.floor(t)+(d<=.125?0:d<.375?.25:d<.625?.5:d<.875?.75:1);
  out("taximetro_valor").textContent = money(t,2);
}

/* ================= LISTENERS ================= */
["millas","paradas"].forEach(i=>out(i).oninput=calcularTarifas);
["horas","minutos"].forEach(i=>out(i).oninput=calcularViajeLargo);
["millas_taximetro","hora_inicio","min_inicio","hora_fin","min_fin"].forEach(i=>out(i).oninput=calcularTaximetro);

calcularTarifas();
calcularViajeLargo();
calcularTaximetro();
