import ProductCard from "../../components/product/ProductCard";
import products from "../../data/product";

function Home() {
  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Latest Products
      </h2>

      <div className="row">

        {products.map((product) => (

          <div
            className="col-md-3 mb-4"
            key={product.id}
          >
            <ProductCard product={product} />
          </div>

        ))}

      </div>

    </div>
  );
}

export default Home;