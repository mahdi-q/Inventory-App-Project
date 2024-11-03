import CategoryView from "./CategoryView.js";
import ProductView from "./ProductView.js";
import "../css/main.css"

document.addEventListener("DOMContentLoaded", () => {
  // set app => get categories & products
  CategoryView.setApp();
  ProductView.setApp();

  // add our categories
  CategoryView.creatCategoriesOption();
  // add our products
  ProductView.creatProductsList(ProductView.products);
});
