/* ===========================
   HELPERS
=========================== */
function out(id) {
  return document.getElementById(id);
}

function setMoney(id, value, decimals = 0) {
  if (value === "" || value === null || isNaN(value)) {
    out(id).textContent = "$ 0";
    return;
  }

  const formatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value);

  out(id).textContent = "$ " + formatted;
}

/* ===========================
   MAIN CALC
=========================== */
function calcular() {
  const fieldname2 = parseFloat(out("millas").value) || 0;
  const fieldname21 = parseInt(out("paradas").value) || 0;

  /* ===========================
     TARIFA SIN DESCUENTO
  =========================== */
  let fieldname1 = fieldname2 * 2 + 2;

  if (fieldname1 < 6) {
    fieldname1 = 6;
  }

  if (fieldname21 === 1) {
    fieldname1 += 2;
  } else if (fieldname21 > 1) {
    fieldname1 += 2 + (fieldname21 - 1);
  }

  /* ===========================
     CLASIFICACIÓN
  =========================== */
  let clasificacion = "";
  if (fieldname1 < 19.75) {
    clasificacion = "Es menor a $19,75";
  } else if (fieldname1 <= 29.75) {
    clasificacion = "Es mayor a $19,75 pero menor a $29,75";
  } else if (fieldname1 < 40) {
    clasificacion = "Es mayor a $29,75 pero menor a $40,00";
  } else {
    clasificacion = "Es mayor a $40,00";
  }

  /* ===========================
     DESCUENTO TEXTO
  =========================== */
  let descuentoTxt = "";
  if (fieldname1 < 19.75) descuentoTxt = "10%";
  else if (fieldname1 <= 29.75) descuentoTxt = "15%";
  else if (fieldname1 < 40) descuentoTxt = "20%";
  else descuentoTxt = "25%";

  /* ===========================
     TARIFA CON DESCUENTO
  =========================== */
  let discountBase = fieldname2 * 2 + 2;
  let discount = 0;

  if (discountBase < 7) {
    discount = 6;
  } else if (discountBase < 19.75) {
    discount = discountBase * 0.9;
  } else if (discountBase <= 29.75) {
    discount = discountBase * 0.85;
  } else if (discountBase < 40) {
    discount = discountBase * 0.8;
  } else {
    discount = discountBase * 0.75;
  }

  if (fieldname21 === 1) discount += 2;
  else if (fieldname21 > 1) discount += 2 + (fieldname21 - 1);

  /* ===========================
     VAN
  =========================== */
  let vanBase = fieldname2 * 2 + 2;
  let vanValue = 0;

  if (vanBase < 8) {
    vanValue = 8;
  } else if (vanBase < 19.75) {
    vanValue = vanBase;
  } else if (vanBase <= 39.75) {
    vanValue = vanBase * 0.9;
  } else {
    vanValue = vanBase * 0.85;
  }

  if (fieldname21 === 1) vanValue += 2;
  else if (fieldname21 > 1) vanValue += 2 + (fieldname21 - 1);

  /* ===========================
     TRABAJO
  =========================== */
  let trabajoValue = 0;

  if (discountBase < 7) {
    trabajoValue = 6;
  } else if (discountBase < 19.75) {
    trabajoValue = discountBase * 0.8;
  } else {
    trabajoValue = discountBase * 0.75;
  }

  if (fieldname21 === 1) trabajoValue += 2;
  else if (fieldname21 > 1) trabajoValue += 2 + (fieldname21 - 1);

  /* ===========================
     TRABAJO VAN
  =========================== */
  let trabajoVanValue = 0;

  if (vanBase < 8) {
    trabajoVanValue = 8;
  } else if (vanBase < 19.75) {
    trabajoVanValue = vanBase * 0.9;
  } else {
    trabajoVanValue = vanBase * 0.85;
  }

  if (fieldname21 === 1) trabajoVanValue += 2;
  else if (fieldname21 > 1) trabajoVanValue += 2 + (fieldname21 - 1);

  /* ===========================
     DELIVERY COMIDA
  =========================== */
  let comidaValue = 0;

  if (fieldname2 <= 2.6) {
    comidaValue = 12;
  } else {
    let suma = fieldname2 * 2 + 2;
    if (suma < 19.75) comidaValue = suma * 0.9 + 5;
    else if (suma < 29.75) comidaValue = suma * 0.85 + 5;
    else comidaValue = suma * 0.8 + 5;
  }

  if (fieldname21 === 1) comidaValue += 2;
  else if (fieldname21 > 1) comidaValue += 2 + (fieldname21 - 1);

  /* ===========================
     DELIVERY ALCOHOL
  =========================== */
  let alcoholValue = 0;

  if (fieldname2 <= 4.8) {
    alcoholValue = 17;
  } else {
    let suma = fieldname2 * 2 + 2;
    if (suma < 19.75) alcoholValue = suma * 0.9 + 7;
    else if (suma < 29.75) alcoholValue = suma * 0.85 + 7;
    else alcoholValue = suma * 0.8 + 7;
  }

  if (fieldname21 === 1) alcoholValue += 2;
  else if (fieldname21 > 1) alcoholValue += 2 + (fieldname21 - 1);

  /* ===========================
     OBJETO PERDIDO
  =========================== */
  let objetoValue = (fieldname2 * 2 + 2) * 0.75;
  if (objetoValue < 6) objetoValue = 6;

  /* ===========================
     OUTPUT (ÚNICO WRITE)
  =========================== */
  setMoney("sin_descuento", fieldname1, 2);
  out("clasificacion").innerText = clasificacion;
  out("descuento").innerText = descuentoTxt;
  setMoney("con_descuento", discount, 2);
  setMoney("van", vanValue);
  setMoney("trabajo", trabajoValue);
  setMoney("trabajo_van", trabajoVanValue);
  setMoney("delivery_comida", comidaValue);
  setMoney("delivery_alcohol", alcoholValue);
  setMoney("objeto", objetoValue);
}

/* ===========================
   EVENTS
=========================== */
out("millas").addEventListener("input", calcular);
out("paradas").addEventListener("input", calcular);
calcular();


