const millasInput = document.getElementById("millas");
const paradasInput = document.getElementById("paradas");

const out = id => document.getElementById(id);

function calcular() {

  const fieldname2 = parseFloat(millasInput.value) || 0;
  const fieldname21 = parseInt(paradasInput.value) || 0;

  /* =========================
     TARIFA SIN DESCUENTO
  ========================= */
  let fieldname1 = fieldname2 * 2 + 2;

  if (fieldname1 < 6) {
    fieldname1 = 6;
    out("sin_descuento").innerText = "$ 6";
  } else {
    if (fieldname21 === 1) fieldname1 += 2;
    else if (fieldname21 > 1) fieldname1 += 2 + (fieldname21 - 1);

    out("sin_descuento").innerText = "$ " + fieldname1.toFixed(2);
  }

  /* =========================
     CLASIFICACIÓN
  ========================= */
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
  out("clasificacion").innerText = clasificacion;

  /* =========================
     DESCUENTO (%)
  ========================= */
  let descuentoTxt = "";
  if (fieldname1 < 19.75) descuentoTxt = "10%";
  else if (fieldname1 <= 29.75) descuentoTxt = "15%";
  else if (fieldname1 < 40) descuentoTxt = "20%";
  else descuentoTxt = "25%";

  out("descuento").innerText = descuentoTxt;

  /* =========================
     TARIFA CON DESCUENTO
  ========================= */
  let valor = fieldname2 * 2 + 2;
  let discount = 0;

  if (valor < 7) {
    out("con_descuento").innerText = "$ 6";
  } else {
    if (valor < 19.75) discount = valor * 0.9;
    else if (valor <= 29.75) discount = valor * 0.85;
    else if (valor < 40) discount = valor * 0.8;
    else discount = valor * 0.75;

    if (fieldname21 === 1) discount += 2;
    else if (fieldname21 > 1) discount += 2 + (fieldname21 - 1);

    out("con_descuento").innerText = "$ " + discount.toFixed(2);
  }

  /* =========================
     VAN
  ========================= */
  let vanValue;
  if (valor < 8) {
    vanValue = 8;
  } else {
    if (valor < 19.75) vanValue = valor;
    else if (valor <= 39.75) vanValue = valor * 0.9;
    else vanValue = valor * 0.85;

    if (fieldname21 === 1) vanValue += 2;
    else if (fieldname21 > 1) vanValue += 2 + (fieldname21 - 1);
  }
  out("van").innerText = "$ " + Math.round(vanValue);

  /* =========================
     TRABAJO
  ========================= */
  let trabajoValue;
  if (valor < 7) {
    trabajoValue = 6;
  } else {
    trabajoValue = valor < 19.75 ? valor * 0.8 : valor * 0.75;

    if (fieldname21 === 1) trabajoValue += 2;
    else if (fieldname21 > 1) trabajoValue += 2 + (fieldname21 - 1);
  }
  out("trabajo").innerText = "$ " + Math.round(trabajoValue);

  /* =========================
     TRABAJO VAN
  ========================= */
  let trabajoVanValue;
  if (valor < 8) {
    trabajoVanValue = 8;
  } else {
    trabajoVanValue = valor < 19.75 ? valor * 0.9 : valor * 0.85;

    if (fieldname21 === 1) trabajoVanValue += 2;
    else if (fieldname21 > 1) trabajoVanValue += 2 + (fieldname21 - 1);
  }
  out("trabajo_van").innerText = "$ " + Math.round(trabajoVanValue);

  /* =========================
     DELIVERY COMIDA
  ========================= */
  let comidaValue;
  if (fieldname2 <= 2.6) {
    comidaValue = 12;
  } else {
    if (valor < 19.75) comidaValue = valor * 0.9 + 5;
    else if (valor < 29.75) comidaValue = valor * 0.85 + 5;
    else comidaValue = valor * 0.8 + 5;
  }

  if (fieldname21 === 1) comidaValue += 2;
  else if (fieldname21 > 1) comidaValue += 2 + (fieldname21 - 1);

  out("delivery_comida").innerText = "$ " + Math.round(comidaValue);

  /* =========================
     DELIVERY ALCOHOL
  ========================= */
  let alcoholValue;
  if (fieldname2 <= 4.8) {
    alcoholValue = 17;
  } else {
    if (valor < 19.75) alcoholValue = valor * 0.9 + 7;
    else if (valor < 29.75) alcoholValue = valor * 0.85 + 7;
    else alcoholValue = valor * 0.8 + 7;
  }

  if (fieldname21 === 1) alcoholValue += 2;
  else if (fieldname21 > 1) alcoholValue += 2 + (fieldname21 - 1);

  out("delivery_alcohol").innerText = "$ " + Math.round(alcoholValue);

  /* =========================
     OBJETO PERDIDO
  ========================= */
  let objetoValue = (fieldname2 * 2 + 2) * 0.75;
  if (objetoValue < 6) objetoValue = 6;

  out("objeto").innerText = "$ " + Math.round(objetoValue);
}

millasInput.addEventListener("input", calcular);
paradasInput.addEventListener("input", calcular);
calcular();
