import Storage from "./Storage.js";

const titleInput = document.querySelector("#product-title");
const quantityInput = document.querySelector("#product-quantity");
const categoryInput = document.querySelector("#selected-category");
const confirmBtn = document.querySelector("#add-new-product");
const cancelBtn = document.querySelector("#product-cancel-btn");
const productsList = document.querySelector("#products-list");
const searchInput = document.querySelector("#search-input");
const sortInputByCategory = document.querySelector("#sort-products-category");
const sortInputByDate = document.querySelector("#sort-products-date");
const appContent = document.querySelector("#app-content");
const editContant = document.querySelector("#edit-content");
const productForm = document.querySelector("#product-form");
const creatFormBtn = document.querySelector("#creat-product-form-btn");

class ProductView {
  constructor() {
    confirmBtn.addEventListener("click", (e) => this.addNewProduct(e));
    searchInput.addEventListener("input", (e) => this.searchProducts(e));
    sortInputByCategory.addEventListener("change", () => this.sortProducts());
    sortInputByDate.addEventListener("change", () => this.sortProducts());
    creatFormBtn.addEventListener("click", (e) => this.creatProductForm(e));
    cancelBtn.addEventListener("click", (e) => this.cancelAddNewProduct(e));

    this.creatCategoriesOption();

    this.products = [];
  }

  setApp() {
    this.products = Storage.getAllProducts();
  }

  addNewProduct(e) {
    e.preventDefault();

    const newProduct = {
      title: titleInput.value,
      quantity: quantityInput.value,
      category: categoryInput.attributes.value,
    };

    if (
      !newProduct.title ||
      !newProduct.quantity ||
      !newProduct.category ||
      newProduct.quantity < 0
    )
      return alert("Please fill the blanks correctly");

    Storage.saveProduct(newProduct);

    titleInput.value = "";
    quantityInput.value = "";
    categoryInput.attributes.value = "";

    this.products = Storage.getAllProducts();
    this.creatProductsList(this.products);
    this.sortProducts();

    productForm.classList.add("hidden");
    creatFormBtn.classList.remove("hidden");
  }

  creatProductsList(products) {
    if (products.length === 0) productsList.innerHTML = "";

    let result = "";

    products.forEach((p) => {
      const selectedCategory = Storage.getAllCategories().find(
        (c) => JSON.parse(c.id) === JSON.parse(p.category)
      );

      result += `
            <div class="flex flex-row items-center justify-between">
              <span class="text-slate-300">${p.title}</span>
              <div class="flex flex-row items-center justify-center gap-x-2">
                <span class="text-slate-300 text-sm">${new Date().toLocaleDateString(
                  "en-us"
                )}</span>
                <span
                  class="flex items-center justify-center text-slate-300 text-sm border border-slate-400 rounded-2xl px-3 h-7"
                  >${selectedCategory.title}</span
                >
                <span
                  class="flex items-center justify-center text-slate-300 text-sm border border-slate-400 rounded-full w-7 h-7"
                  >${p.quantity}</span
                >
                <button
                  class="edit-product-btn flex items-center justify-center text-green-400 text-sm border border-green-400 rounded-2xl px-2 h-7" data-product-id="${
                    p.id
                  }">
                  edit
                </button>
                <button
                  class="delete-product-btn flex items-center justify-center text-red-400 text-sm border border-red-400 rounded-2xl px-2 h-7" data-product-id="${
                    p.id
                  }">
                  delete
                </button>
              </div>
            </div>
        `;
    });
    productsList.innerHTML = result;

    const deleteProductBtns = [
      ...document.querySelectorAll(".delete-product-btn"),
    ];
    deleteProductBtns.forEach((btn) =>
      btn.addEventListener("click", (e) => this.deleteProduct(e))
    );

    const editProductBtns = [...document.querySelectorAll(".edit-product-btn")];
    editProductBtns.forEach((btn) =>
      btn.addEventListener("click", (e) => this.editProduct(e))
    );
  }

  searchProducts(e) {
    const value = e.target.value.trim().toLowerCase();

    const filteredProducts = this.sortProducts().filter((p) =>
      p.title.trim().toLowerCase().includes(value)
    );

    productsList.innerHTML = "";
    this.creatProductsList(filteredProducts);
  }

  creatCategoriesOption() {
    let result = `
      <option class="bg-slate-600 text-slate-300" value="">All</option>
    `;
    Storage.getAllCategories().forEach((c) => {
      result += `
          <option class="bg-slate-600 text-slate-300" value="${c.id}"> ${c.title} </option>
        `;
    });
    sortInputByCategory.innerHTML = result;
  }

  sortProducts() {
    const categoryValue = sortInputByCategory.value;
    const dateValue = sortInputByDate.value;

    let filteredProducts = this.products;

    if (categoryValue !== "") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === parseInt(categoryValue)
      );
    }

    filteredProducts = filteredProducts.sort((a, b) => {
      if (dateValue === "newest") {
        return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
      } else if (dateValue === "oldest") {
        return new Date(a.updated) < new Date(b.updated) ? -1 : 1;
      }
    });

    this.creatProductsList(filteredProducts);
    return filteredProducts;
  }

  deleteProduct(e) {
    const dataId = e.target.dataset.productId;

    Storage.deleteProduct(dataId);
    this.products = Storage.getAllProducts();
    this.creatProductsList(this.products);
    this.sortProducts();
  }

  editProduct(e) {
    e.preventDefault();

    const dataId = e.target.dataset.productId;
    const selectedProduct = this.products.find(
      (p) => p.id === parseInt(dataId)
    );

    this.openEditProduct();

    const editTitle = document.getElementById("edit-title");
    const editQuantity = document.getElementById("edit-quantity");
    const editCategoryt = document.getElementById("edit-category");

    editTitle.value = selectedProduct.title;
    editQuantity.value = selectedProduct.quantity;
    editCategoryt.value = selectedProduct.category;

    const editedProduct = {
      id: selectedProduct.id,
    };

    document
      .getElementById("edit-product-btn")
      .addEventListener("click", (e) => {
        e.preventDefault();

        (editedProduct.title = editTitle.value),
          (editedProduct.quantity = editQuantity.value),
          (editedProduct.category = editCategoryt.value),
          (editedProduct.updated = new Date().toISOString());

        if (
          editedProduct.title !== selectedProduct.title ||
          editedProduct.quantity !== selectedProduct.quantity ||
          editedProduct.category !== selectedProduct.category
        ) {
          Storage.saveProduct(editedProduct);

          this.products = Storage.getAllProducts();
          this.creatProductsList(this.products);
          this.sortProducts();
          this.closeEditProduct();
        } else {
          return alert("Please change one of the values");
        }
      });

    document
      .getElementById("cancel-edit-btn")
      .addEventListener("click", (e) => {
        e.preventDefault();

        this.closeEditProduct();
      });
  }

  openEditProduct() {
    appContent.classList.add("blur-sm", "disabled-div", "pointer-events-none");

    editContant.innerHTML = `
          <h2 class="text-slate-300 font-bold text-xl mb-2 text-center">
            Edit Product
          </h2>

          <form class="flex flex-col bg-slate-700 rounded-xl p-4 gap-y-4 border border-slate-400">
            <div>
              <label for="edit-title" class="text-slate-300 block mb-1"
                >Title</label
              >
              <input
                type="text"
                name="edit-title"
                id="edit-title"
                class="bg-transparent border border-slate-500 text-slate-400 rounded-xl py-1"
              />
            </div>

            <div>
              <label for="edit-quantity" class="text-slate-300 block mb-1"
                >Quantity</label
              >
              <input
                type="number"
                name="edit-quantity"
                id="edit-quantity"
                class="bg-transparent border border-slate-500 text-slate-400 rounded-xl py-1"
              />
            </div>

            <div>
              <label for="edit-category" class="text-slate-300 block mb-1"
                >Category</label
              >
              <select
                name="edit-category"
                id="edit-category"
                class="bg-transparent border border-slate-500 text-slate-400 rounded-xl w-full py-1"
              >
              </select>
            </div>

            <div class="flex items-center justify-between gap-x-3">
              <button
                id="cancel-edit-btn"
                class="flex-1 text-slate-200 bg-slate-500 border border-slate-500 rounded-xl py-1"
              >
                Cancel
              </button>
              <button
                id="edit-product-btn"
                class="flex-1 text-slate-200 bg-slate-500 border border-slate-500 rounded-xl py-1"
              >
                Edit Product
              </button>
            </div>
          </form>
    `;

    let result = "";
    Storage.getAllCategories().forEach((c) => {
      result += `
          <option class="bg-slate-600 text-slate-300" value="${c.id}"> ${c.title} </option>
        `;

      document.getElementById("edit-category").innerHTML = result;
    });
  }

  closeEditProduct() {
    editContant.innerHTML = "";

    appContent.classList.remove(
      "blur-sm",
      "disabled-div",
      "pointer-events-none"
    );
  }

  creatProductForm(e) {
    e.preventDefault();

    productForm.classList.remove("hidden");
    creatFormBtn.classList.add("hidden");
  }

  cancelAddNewProduct(e) {
    e.preventDefault();

    titleInput.value = "";
    quantityInput.value = "";
    categoryInput.attributes.value = "";
    categoryInput.innerHTML = "select a category ...";

    productForm.classList.add("hidden");
    creatFormBtn.classList.remove("hidden");
  }
}

export default new ProductView();
