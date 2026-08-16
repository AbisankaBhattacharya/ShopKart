import api from "./axios";

const productApi = {
  async getProducts() {
    const response = await api.get("/products");
    return response.data.data.products;
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data.data.product;
  },
};

export default productApi;
