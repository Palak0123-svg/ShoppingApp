import React, { useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useState } from "react";
import axios from "axios";
import { Checkbox, Radio  } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate ,Link} from "react-router-dom";
import { useCart } from "../context/Cart";
const HomePage = () => {
  const navigate = useNavigate();
  const [cart,setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  //get all category (copy from create category page)
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-allcategory`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      alert("something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // get all product
  const getAllProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data?.products); // changes products to product
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("error while getting all product in home page");
    }
  };

  // get  count of total product
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.totalProduct);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (page === 1) return;
    loadmore();
  }, [page]);
  //Load more
  const loadmore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //filter by category
  const handleFilter = (value, id) => {
    let all = [...checked]; // making clone of prev checked array
    if (value) {
      all.push(id); // pushing id into all array
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all); // updating checked array
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProduct();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    }
  }, [checked, radio]);

  // get fillter product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filter`,
        { checked, radio }
      );
      const filteredProducts = data?.products;
      setProducts(filteredProducts);
    } catch (error) {
      console.log(error);
    }
  };

  // load is done my me
  // const load = loading ? "Loading ...":"Loadmore";

  return (
    <Layout title={" ALL Product-Best offers "}>
      <div className="row mt-3 m-2">
        <div className="col-md-2">
          <h4 className="text-center">Filter by category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => {
              return (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                >
                  {c.name}
                </Checkbox>
              );
            })}
          </div>

          {/* price filter */}
          <h4 className="text-center mt-4">Filter by Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => {
                return (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                );
              })}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column m-1">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </button>
          </div>
        </div>
        <div className="col-md-9">
          {/* {JSON.stringify(checked,null,4)} */}
          <h1 className="text-center">All products</h1>
          <div className="d-flex flex-wrap Mypro-container Myflex" id="Myproduct">
            {/* {console.log("products while maping" + products.length)} */}
            {products?.map((p) => {
              return (
                <>
                <Link to={`/product/${p.slug}`}  className="product-link">
                  <div className="card m-2 Mypro" style={{ width: "18rem" }}>
                    <img
                      className="card-img-top"
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                    />
                    <div className="card-body">
                      <div className=" ">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text ">
                        {p.description.substring(0, 30)}
                      </p>
                      </div>
                      <div className="Mytext Myflex ">
                      <p className="price"> <span>{p.price}</span>$</p>
                      <button class="btn btn-primary m-1" onClick={()=>{
                        setCart([...cart,p])
                        localStorage.setItem("cart",JSON.stringify([...cart,p]));
                        alert("Item added to cart");
                      }}>Add to Cart</button>
                      {/* <button
                        class="btn btn-secondary"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button> */}
                      </div>
                    </div>
                  </div>
                  </Link>
                </>
              );
            })}
          </div>

          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {/* done by me */}
                {/* {products.length?load:<p>No product to show</p>} */}
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
