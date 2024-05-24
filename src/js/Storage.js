const products = [
  {
    id: 1,
    title: "Laptop-1",
    quantity: 8,
    category: "Samsung",
    updated: "2024-01-24T13:59:32.096Z",
  },
  {
    id: 2,
    title: "Laptop-2",
    quantity: 18,
    category: "Asus",
    updated: "2024-09-24T13:59:32.096Z",
  },
  {
    id: 3,
    title: "Laptop-3",
    quantity: 3,
    category: "Apple",
    updated: "2024-06-24T13:59:32.096Z",
  },
];

const categories = [
  {
    id: 1,
    title: "Samsung",
    description: "Lorem ipsum dolor sit amet.",
    createdAt: "2024-11-24T13:59:32.096Z",
  },
  {
    id: 2,
    title: "Apple",
    description: "Lorem ipsum dolor sit amet.",
    createdAt: "2024-01-24T13:59:32.096Z",
  },
  {
    id: 3,
    title: "Asus",
    description: "Lorem ipsum dolor sit amet.",
    createdAt: "2024-05-24T13:59:32.096Z",
  },
];

export default class Storage {
  static getAllCategories() {
    const savedCategories = JSON.parse(localStorage.getItem("category")) || [];
    // sort our categories
    const sortedCategories = savedCategories.sort((a, b) => {
      return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
    });

    return sortedCategories;
  }

  static saveCategory(categoryToSave) {
    // edit  category => save
    // new category => save

    const savedCategories = this.getAllCategories();

    const existedItem = savedCategories.find((c) => c.id === categoryToSave.id);

    if (existedItem) {
      // edit
      existedItem.title = categoryToSave.title;
      existedItem.description = categoryToSave.description;
    } else {
      // new
      categoryToSave.id = new Date().getTime();
      categoryToSave.createdAt = new Date().toISOString();
      savedCategories.push(categoryToSave);
    }

    localStorage.setItem("category", JSON.stringify(savedCategories));
  }

  static deleteCategory(id) {
    const savedCategories = this.getAllCategories();
    const filteredCategories = savedCategories.filter((c) => c.id != id);
    localStorage.setItem("category", JSON.stringify(filteredCategories));
  }

  static getAllProducts() {
    const savedProducts = JSON.parse(localStorage.getItem("product")) || [];
    // sort our products
    const sortedProducts = savedProducts.sort((a, b) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });

    return sortedProducts;
  }

  static saveProduct(productToSave) {
    // edit  product => save
    // new product => save

    const savedProducts = this.getAllProducts();
    const existedItem = savedProducts.find((p) => p.id === productToSave.id);

    if (existedItem) {
      // edit
      existedItem.title = productToSave.title;
      existedItem.quantity = productToSave.quantity;
      existedItem.category = productToSave.category;
      existedItem.updated = productToSave.updated;
    } else {
      // new
      productToSave.id = new Date().getTime();
      productToSave.updated = new Date().toISOString();
      savedProducts.push(productToSave);
    }

    localStorage.setItem("product", JSON.stringify(savedProducts));
  }

  static deleteProduct(id) {
    const savedProducts = this.getAllProducts();
    const filteredProducts = savedProducts.filter((p) => p.id != id);
    localStorage.setItem("product", JSON.stringify(filteredProducts));
  }
}
