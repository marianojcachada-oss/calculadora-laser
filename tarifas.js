document.addEventListener("DOMContentLoaded", () => {

  const millas = document.getElementById("millas");
  const paradas = document.getElementById("paradas");

  const sinDesc = document.getElementById("sin_descuento");
  const clasificacion = document.getElementById("clasificacion");
  const descuento = document.getElementById("descuento");
  const conDesc = document.getElementById("con_descuento");
  const van = document.getElementById("van");
  const trabajo = document.getElementById("trabajo");
  const trabajoVan = document.getElementById("trabajo_van");
  const deliveryComida = document.getElementById("delivery_comida");
  const deliveryAlcohol = document.getElementById("delivery_alcohol");
  const objeto = document.getElementById("objeto");

  function calcularTarifaBase(m) {
    // Fórmula base que usabas
    return (m * 2) + 2;
  }

  function aplicarParadas(valor, p) {
    if (p <= 0) return valor;
    if (p === 1) return valor + 2;
    return valor + 2 + (p - 1);
  }

  function obtenerDescuento(valor) {
    if (valor < 19.75) return 0.10;
    if (valor <= 29.75) return 0.15;
    if (valor < 40) return 0.20;
    return 0.25;
  }

  function textoClasificacion(valor) {
    if (valor < 19.75) return "Es menor a $19.75";
    if (valor <= 29.75) return "Entre $19.75 y $29.75";
    if (valor < 40) return "Entre $29.75 y $40";
    return "Mayor a $40";
  }

  function calcular() {
    const m = Number(millas.value || 0);
    const p = Number(paradas.value || 0);

    let base = calcularTarifaBase(m);
    base = Math.max(base, 6);
    base = aplicarParadas(base, p);

    const desc = obtenerDescuento(base);
    const conDescuento = Math.round(base * (1 - desc));

    sinDesc.innerText = `USD ${base.toFixed(2)}`;
    clasificacion.innerText = textoClasificacion(base);
    descuento.innerText = `${desc * 100}%`;
    conDesc.innerText = `USD ${conDescuento}`;

    van.innerText = `USD ${Math.round(base * 0.9)}`;
    trabajo.innerText = `USD ${Math.round(base * 0.8)}`;
    trabajoVan.innerText = `USD ${Math.round(base * 0.85)}`;

    deliveryComida.innerText = `USD ${Math.round(base + 5)}`;
    deliveryAlcohol.innerText = `USD ${Math.round(base + 7)}`;

    objeto.innerText = `USD ${Math.max(6, Math.round(base * 0.75))}`;
  }

  millas.addEventListener("input", calcular);
  paradas.addEventListener("input", calcular);

  calcular();
});
