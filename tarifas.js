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
    out("sin_descuento").innerText = "U$D 6";
    fieldname1 = 6;
  } else {
    if (fieldname21 == 1) fieldname1 += 2;
    else if (fieldname21 > 1) fieldname1 += 2 + (fieldname21 - 1);
    out("sin_descuento").innerText = "U$D " + fieldname1.toFixed(2);
  }

  /* =========================
     CLASIFICACIÓN
  ========================= */
  let clasificacion = "";
  if (fieldname1 < 19.75) clasificacion = "Es menor a $19,75";
  else if (fieldname1 <= 29.75) clasificacion = "Es mayor a $19,75 pero menor a $29,75";
  else if (fieldname1 < 40) clasificacion = "Es mayor a $29,75 pero menor a $40,00";
  else clasificacion = "Es mayor a $40,00";

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
  let discount = 0;
  let valor = fieldname2 * 2 + 2;

  if (valor < 7) {
    out("con_descuento").innerText = "U$D 6";
  } else {
    if (valor < 19.75) discount = valor * 0.9;
    else if (valor <= 29.75) discount = valor * 0.85;
    else if (valor < 40) discount = valor * 0.8;
    else discount = valor * 0.75;

    if (fieldname21 == 1) discount += 2;
    else if (fieldname21 > 1) discount += 2 + (fieldname21 - 1);

    out("con_descuento").innerText = "U$D " + discount.toFixed(2);
  }

  /* =========================
     VAN
  ========================= */
  let van = valor < 8 ? "U$D 8" : Math.round(
    (valor < 19.75 ? valor :
     valor <= 39.75 ? valor * 0.9 :
     valor * 0.85)
    + (fieldname21 > 0 ? 2 + Math.max(0, fieldname21 - 1) : 0)
  );
  out("van").innerText = van;

  /* =========================
     TRABAJO
  ========================= */
  let trabajo = valor < 7 ? "U$D 6" : Math.round(
    (valor < 19.75 ? valor * 0.8 : valor * 0.75)
    + (fieldname21 > 0 ? 2 + Math.max(0, fieldname21 - 1) : 0)
  );
  out("trabajo").innerText = trabajo;

  /* =========================
     TRABAJO VAN
  ========================= */
  let trabajoVan = valor < 8 ? "U$D 8" : Math.round(
    (valor < 19.75 ? valor * 0.9 : valor * 0.85)
    + (fieldname21 > 0 ? 2 + Math.max(0, fieldname21 - 1) : 0)
  );
  out("trabajo_van").innerText = trabajoVan;

  /* =========================
     DELIVERY COMIDA
  ========================= */
  let comida = fieldname2 <= 2.6 ? 12 : (
    valor < 19.75 ? valor * 0.9 + 5 :
    valor < 29.75 ? valor * 0.85 + 5 :
    valor * 0.8 + 5
  );
  comida += fieldname21 > 0 ? 2 + Math.max(0, fieldname21 - 1) : 0;
  out("delivery_comida").innerText = Math.round(comida);

  /* =========================
     DELIVERY ALCOHOL
  ========================= */
  let alcohol = fieldname2 <= 4.8 ? 17 : (
    valor < 19.75 ? valor * 0.9 + 7 :
    valor < 29.75 ? valor * 0.85 + 7 :
    valor * 0.8 + 7
  );
  alcohol += fieldname21 > 0 ? 2 + Math.max(0, fieldname21 - 1) : 0;
  out("delivery_alcohol").innerText = Math.round(alcohol);

  /* =========================
     OBJETO PERDIDO
  ========================= */
  let obj = (fieldname2 * 2 + 2) * 0.75;
  out("objeto").innerText = obj < 6 ? "U$D 6" : "U$D " + Math.round(obj);
}

millasInput.addEventListener("input", calcular);
paradasInput.addEventListener("input", calcular);
calcular();


