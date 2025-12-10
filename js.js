let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.getElementById("productos");
const listaCarrito = document.getElementById("lista-carrito");
const total = document.getElementById("total");
const btnFinalizar = document.getElementById("btn-finalizar");
const btnVaciar = document.getElementById("btn-vaciar");

function cargarProductos() {
  fetch("productos.json")
    .then((resp) => resp.json())
    .then((data) => {
      productos = data;
      mostrarProductos();
    });
}

cargarProductos();

function mostrarProductos() {
  contenedorProductos.innerHTML = "";

  productos.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio}</p>
      <button data-id="${prod.id}">🛒 Agregar al carrito</button>
    `;

    contenedorProductos.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  carrito.push(producto);
  actualizarCarrito();

  Swal.fire({
    icon: "success",
    title: "Agregado al carrito",
    text: producto.nombre,
    timer: 1200,
    showConfirmButton: false
  });
}

contenedorProductos.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = Number(e.target.dataset.id);
    agregarAlCarrito(id);
  }
});

function actualizarCarrito() {
  listaCarrito.innerHTML = "";

  carrito.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${item.nombre} - $${item.precio}
      <button class="btn-eliminar" data-index="${index}">❌</button>
    `;

    listaCarrito.appendChild(li);
  });

  const totalCompra = carrito.reduce((acc, p) => acc + p.precio, 0);
  total.textContent = "Total: $" + totalCompra;

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

listaCarrito.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar")) {
    const index = Number(e.target.dataset.index);
    carrito.splice(index, 1);
    actualizarCarrito();
  }
});

btnVaciar.addEventListener("click", () => {
  Swal.fire({
    title: "¿Vaciar carrito?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Vaciar",
    cancelButtonText: "Cancelar"
  }).then((res) => {
    if (res.isConfirmed) {
      carrito = [];
      actualizarCarrito();
      Swal.fire("Carrito vacío", "", "success");
    }
  });
});

btnFinalizar.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Carrito vacío",
      text: "Agregá un producto para continuar"
    });
    return;
  }

  Swal.fire({
    icon: "success",
    title: "Compra realizada",
    text: "Gracias por tu compra"
  });

  carrito = [];
  actualizarCarrito();
});
