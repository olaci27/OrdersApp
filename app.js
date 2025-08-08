/***************
 * Configuración
 ***************/
const PRICE = 20000; // COP por unidad
const CURRENCY = "COP";
const ITEMS = [
  { id: 1, name: "Pollo Costilla",  img: "assets/dish.jpg" },
  { id: 2, name: "Pollo Tocino",    img: "assets/dish.jpg" },
  { id: 3, name: "Tocino Costilla", img: "assets/dish.jpg" },
  { id: 4, name: "Tocino Pollo",    img: "assets/dish.jpg" },
];
const INITIAL_QTY = 0; // arranca en 0 como pediste

/***************
 * Estado
 ***************/
const quantities = Object.fromEntries(ITEMS.map(i => [i.id, INITIAL_QTY]));

/***************
 * Utilidades
 ***************/
const $ = (sel) => document.querySelector(sel);
const money = (n) => {
  const s = n.toLocaleString("es-CO");
  return `$${s.replace(/,/g, ".")} ${CURRENCY}`;
};
const getQtyTotal = () =>
  Object.values(quantities).reduce((a, b) => a + (b || 0), 0);

/***************
 * Render de tarjetas
 ***************/
function renderCards() {
  const container = $("#cards");
  container.innerHTML = ""; // limpiamos

  ITEMS.forEach(item => {
    const qty = quantities[item.id] ?? 0;
    const total = qty * PRICE;

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div>
        <div class="title">${item.name}</div>
        <div class="price">Precio: ${money(PRICE)}</div>
        <div class="qty" data-id="${item.id}">
          <button class="minus" aria-label="disminuir">−</button>
          <div class="val">${qty}</div>
          <button class="plus" aria-label="aumentar">+</button>
        </div>
      </div>
      <div class="card-total">${money(total)}</div>
    `;

    container.appendChild(card);
  });
}

/***************
 * Totales (footer)
 ***************/
function computeTotals() {
  const qtyTotal = getQtyTotal();
  const subtotal = qtyTotal * PRICE;

  $("#qtyTotal").textContent = qtyTotal;
  $("#subtotal").textContent = money(subtotal);
}

/***************
 * Eventos
 ***************/
function attachEvents() {
  // Delegación de clicks en los controles +/- dentro de #cards
  $("#cards").addEventListener("click", (ev) => {
    const btn = ev.target.closest("button");
    if (!btn) return;

    const qtyBox = ev.target.closest(".qty");
    if (!qtyBox) return;

    const id = Number(qtyBox.dataset.id);
    const current = quantities[id] || 0;

    if (btn.classList.contains("minus")) {
      quantities[id] = Math.max(0, current - 1);
    } else if (btn.classList.contains("plus")) {
      quantities[id] = current + 1;
    }

    // Actualiza solo la tarjeta tocada
    qtyBox.querySelector(".val").textContent = quantities[id];
    qtyBox.closest(".card").querySelector(".card-total").textContent =
      money(quantities[id] * PRICE);

    // Recalcula totales
    computeTotals();
  });

  // Validación al pasar a la siguiente página
  $("#nextBtn").addEventListener("click", () => {
    const errorBox = $("#menuError");
    const qtyTotal = getQtyTotal();

    if (qtyTotal <= 0) {
      errorBox.textContent = "Por favor, escoge al menos un producto para continuar.";
      errorBox.style.display = "block";
      errorBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    // Si hay al menos 1 producto, limpia el error y continúa (por ahora solo aviso)
    errorBox.style.display = "none";
    alert("Perfecto. En el siguiente paso escogeremos el día de entrega (sábado o domingo).");
  });
}

/***************
 * Arranque
 ***************/
document.addEventListener("DOMContentLoaded", () => {
  renderCards();
  computeTotals();
  attachEvents();
});