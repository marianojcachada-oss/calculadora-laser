function out(id) {
  return document.getElementById(id);
}

function setMoney(id, value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) {
    out(id).textContent = "$ 0";
    return;
  }
  const formatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value);
  out(id).textContent = "$ " + formatted;
}

function calcular() {
  const millas = parseFloat(out("millas").value) || 0;
  const paradas = parseInt(out("paradas").value) || 0;

  /* ===============================
     PARADAS (AISLADAS)
  =============================== */
  let valorParadas = 0;
  if (paradas === 1) valorParadas = 2;
  else if (paradas > 1) valorParadas = 2 + (paradas - 1);

  /* ===============================
     BASE SIN PARADAS
  =============================== */
  let base = millas * 2 + 2;
  if (base < 6) base = 6;

  /* ===============================
     TARIFA SIN DESCUENTO (VISIBLE)
  =============================== */
  const sinDescuentoFinal = base + valorParadas;
  setMoney("sin_descuento", sinDescuentoFinal, 2);

  /* ===============================
     CLASIFICACIÓN + DESCUENTO
  =============================== */
  let clasificacion = "";
  let factor = 1;
  let descuentoTxt = "";

  if (base < 19.75) {
    clasificacion = "Menor a $19,75";
    factor = 0.9;
    descuentoTxt = "10%";
  } else if (base <= 29.75) {
    clasificacion = "Entre $19,75 y $29,75";
    factor = 0.85;
    descuentoTxt = "15%";
  } else if (base < 40) {
    clasificacion = "Entre $29,75 y $40";
    factor = 0.8;
    descuentoTxt = "20%";
  } else {
    clasificacion = "Mayor a $40";
    factor = 0.75;
    descuentoTxt = "25%";
  }

  out("clasificacion").innerText = clasificacion;
  out("descuento").innerText = descuentoTxt;

  /* ===============================
     TARIFA CON DESCUENTO
  =============================== */
  const conDescuento = base * factor + valorParadas;
  setMoney("con_descuento", conDescuento, 2);

  /* ===============================
     VAN
  =============================== */
  let vanBase = millas * 2 + 2;
  if (vanBase < 8) vanBase = 8;

  let vanFactor = 1;
  if (vanBase >= 19.76 && vanBase <= 39.75) vanFactor = 0.9;
  else if (vanBase >= 40) vanFactor = 0.85;

  const vanFinal = Math.round(vanBase * vanFactor + valorParadas);
  setMoney("van", vanFinal);

  /* ===============================
     TRABAJO
  =============================== */
  let trabajoFactor = base < 19.75 ? 0.8 : 0.75;
  const trabajoFinal = Math.round(base * trabajoFactor + valorParadas);
  setMoney("trabajo", trabajoFinal);

  /* ===============================
     TRABAJO VAN
  =============================== */
  let trabajoVanFactor = base < 19.75 ? 0.9 : 0.85;
  const trabajoVanFinal = Math.round(base * trabajoVanFactor + valorParadas);
  setMoney("trabajo_van", trabajoVanFinal);

  /* ===============================
     DELIVERY COMIDA
  =============================== */
  let comidaValue = 0;
  if (millas <= 2.6) {
    comidaValue = 12;
  } else {
    if (base < 19.75) comidaValue = base * 0.9 + 5;
    else if (base < 29.75) comidaValue = base * 0.85 + 5;
    else comidaValue = base * 0.8 + 5;
  }
  comidaValue += valorParadas;
  setMoney("delivery_comida", comidaValue);

  /* ===============================
     DELIVERY ALCOHOL
  =============================== */
  let alcoholValue = 0;
  if (millas <= 4.8) {
    alcoholValue = 17;
  } else {
    if (base < 19.75) alcoholValue = base * 0.9 + 7;
    else if (base < 29.75) alcoholValue = base * 0.85 + 7;
    else alcoholValue = base * 0.8 + 7;
  }
  alcoholValue += valorParadas;
  setMoney("delivery_alcohol", alcoholValue);

  /* ===============================
     OBJETO PERDIDO
  =============================== */
  let objeto = base * 0.75;
  if (objeto < 6) objeto = 6;
  setMoney("objeto", objeto);
}

/* ===============================
   AUTO CALCULO
=============================== */
["millas", "paradas"].forEach(id => {
  out(id).addEventListener("input", calcular);
});

calcular();
