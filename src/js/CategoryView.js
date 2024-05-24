import ProductView from "./ProductView.js";
import Storage from "./Storage.js";

const titleInput = document.querySelector("#category-title");
const descriptionInput = document.querySelector("#category-description");
const cancelBtn = document.querySelector("#category-cancel-btn");
const confirmBtn = document.querySelector("#add-new-category");
const selectOption = document.querySelector("#product-category");
const categoryForm = document.querySelector("#category-form");
const creatFormBtn = document.querySelector("#creat-category-form-btn");
const categoryListBtn = document.querySelector("#category-list-btn");
const fullBtn = document.querySelector("#category-full-btn");
const selectedCategory = document.querySelector("#selected-category");
const appContent = document.querySelector("#app-content");
const editContant = document.querySelector("#edit-content");

class CategoryView {
  constructor() {
    confirmBtn.addEventListener("click", (e) => this.addNewCategory(e));
    creatFormBtn.addEventListener("click", (e) => this.creatCategoryForm(e));
    cancelBtn.addEventListener("click", (e) => this.cancelAddNewCategory(e));
    fullBtn.addEventListener("click", (e) => this.toggleCategoryList(e));
    categoryListBtn.addEventListener("click", (e) =>
      this.toggleCategoryList(e)
    );

    this.categories = [];
  }

  setApp() {
    this.categories = Storage.getAllCategories();
  }

  addNewCategory(e) {
    e.preventDefault();

    const title = titleInput.value;
    const description = descriptionInput.value;

    if (!title || !description)
      return alert("Please fill the blanks correctly");

    Storage.saveCategory({ title, description });

    titleInput.value = "";
    descriptionInput.value = "";

    this.categories = Storage.getAllCategories();
    this.creatCategoriesOption();
    ProductView.creatCategoriesOption();
    ProductView.sortProducts();

    categoryForm.classList.add("hidden");
    creatFormBtn.classList.remove("hidden");
  }

  creatCategoriesOption() {
    let result = "";

    this.categories.forEach((c) => {
      result += `
          <div
            value="${c.id}"
            class="category-option text-white px-4 py-1 hover:bg-blue-600 flex items-center justify-between"
          >
              <span>${c.title}</span>
              <button class="edit-category-btn" data-category-id="${c.id}">
                <svg
                  data-category-id="${c.id}"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0"
                  y="0"
                  viewBox="0 0 512 511"
                  style="enable-background: new 0 0 512 512"
                  xml:space="preserve"
                  class="h-4 w-4 fill-green-600"
                >
                    <path
                      d="M405.332 256.484c-11.797 0-21.332 9.559-21.332 21.332v170.668c0 11.754-9.559 21.332-21.332 21.332H64c-11.777 0-21.332-9.578-21.332-21.332V149.816c0-11.754 9.555-21.332 21.332-21.332h170.668c11.797 0 21.332-9.558 21.332-21.332 0-11.777-9.535-21.336-21.332-21.336H64c-35.285 0-64 28.715-64 64v298.668c0 35.286 28.715 64 64 64h298.668c35.285 0 64-28.714 64-64V277.816c0-11.796-9.54-21.332-21.336-21.332zm0 0"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                    <path
                      d="M200.02 237.05a10.793 10.793 0 0 0-2.922 5.438l-15.082 75.438c-.703 3.496.406 7.101 2.922 9.64a10.673 10.673 0 0 0 7.554 3.114c.68 0 1.387-.063 2.09-.211l75.414-15.082c2.09-.43 3.988-1.43 5.461-2.926l168.79-168.79-75.415-75.41zM496.383 16.102c-20.797-20.801-54.633-20.801-75.414 0l-29.524 29.523 75.414 75.414 29.524-29.527C506.453 81.465 512 68.066 512 53.816s-5.547-27.648-15.617-37.714zm0 0"
                      opacity="1"
                      data-original="#000000"
                    ></path>
                </svg>
              </button>
          </div>
          `;
    });

    selectOption.innerHTML = result;

    const categoryOptions = [...document.querySelectorAll(".category-option")];
    categoryOptions.forEach((item) => {
      item.addEventListener("click", () => this.changeSelectedCategory(item));
    });

    const editCategoryBtns = [
      ...document.querySelectorAll(".edit-category-btn"),
    ];
    editCategoryBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.editCategory(e));
    });
  }

  creatCategoryForm(e) {
    e.preventDefault();

    categoryForm.classList.remove("hidden");
    creatFormBtn.classList.add("hidden");
  }

  cancelAddNewCategory(e) {
    e.preventDefault();

    titleInput.value = "";
    descriptionInput.value = "";

    categoryForm.classList.add("hidden");
    creatFormBtn.classList.remove("hidden");
  }

  toggleCategoryList(e) {
    e.preventDefault();

    if (selectOption.classList.contains("hidden")) {
      selectOption.classList.remove("hidden");
      fullBtn.classList.remove("hidden");
    } else {
      selectOption.classList.add("hidden");
      fullBtn.classList.add("hidden");
    }
  }

  changeSelectedCategory(item, editedcategory) {
    if (item) {
      const category = this.categories.find((c) => {
        return c.id === parseInt(item.getAttribute("value"));
      });

      selectedCategory.innerHTML = category.title;
      selectedCategory.attributes.value = category.id;
    } else if (editedcategory) {
      selectedCategory.innerHTML = editedcategory.title;
      selectedCategory.attributes.value = editedcategory.id;
    }

    selectOption.classList.add("hidden");
    fullBtn.classList.add("hidden");
  }

  editCategory(e) {
    e.preventDefault()
    e.stopPropagation();

    const dataId = e.target.parentNode.dataset.categoryId;
    const selectedCategory = this.categories.find(
      (c) => c.id === parseInt(dataId)
    );

    this.openEditCategory();

    const editTitle = document.getElementById("category-edit-title");
    const editdescription = document.getElementById(
      "category-edit-description"
    );

    editTitle.value = selectedCategory.title;
    editdescription.value = selectedCategory.description;

    const editedCategory = {
      id: selectedCategory.id,
      createdAt: selectedCategory.createdAt,
    };

    document
      .getElementById("category-edit-btn")
      .addEventListener("click", (e) => {
        e.preventDefault();

        editedCategory.title = editTitle.value;
        editedCategory.description = editdescription.value;

        if (
          editedCategory.title !== selectedCategory.title ||
          editedCategory.description !== selectedCategory.description
        ) {
          Storage.saveCategory(editedCategory);

          this.categories = Storage.getAllCategories();
          this.creatCategoriesOption(this.categories);
          this.closeEditCategory();
          this.changeSelectedCategory("", editedCategory);
          ProductView.creatCategoriesOption();
          ProductView.creatProductsList(ProductView.products);
        } else {
          return alert("Please change one of the values");
        }
      });

    document
      .getElementById("cancel-edit-btn")
      .addEventListener("click", (e) => {
        e.preventDefault();

        this.closeEditCategory();
      });
  }

  openEditCategory() {
    appContent.classList.add("blur-sm", "disabled-div", "pointer-events-none");

    editContant.innerHTML = `
          <h2 class="text-slate-300 font-bold text-xl mb-2 text-center">
            Edit Category
          </h2>

          <form class="flex flex-col bg-slate-700 rounded-xl p-4 gap-y-4 border border-slate-400">
            <div>
                  <label for="category-edit-title" class="text-slate-300 block mb-1"
                    >Title</label
                  >
                  <input
                    type="text"
                    name="category-edit-title"
                    id="category-edit-title"
                    class="bg-transparent border border-slate-500 text-slate-400 rounded-xl py-1"
                  />
                </div>

                <div>
                  <label
                    for="category-edit-description"
                    class="text-slate-300 block mb-1"
                    >Description</label
                  >
                  <textarea
                    name="category-edit-description"
                    id="category-edit-description"
                    class="bg-transparent border border-slate-500 text-slate-400 rounded-xl w-full py-1"
                  ></textarea>
                </div>

            <div class="flex items-center justify-between gap-x-3">
              <button
                id="cancel-edit-btn"
                class="flex-1 text-slate-200 bg-slate-500 border border-slate-500 rounded-xl py-1"
              >
                Cancel
              </button>
              <button
                id="category-edit-btn"
                class="flex-1 text-slate-200 bg-slate-500 border border-slate-500 rounded-xl py-1"
              >
                Edit Category
              </button>
            </div>
          </form>
    `;
  }

  closeEditCategory() {
    editContant.innerHTML = "";

    appContent.classList.remove(
      "blur-sm",
      "disabled-div",
      "pointer-events-none"
    );
  }
}

export default new CategoryView();
