import React ,{useEffect,useState}from 'react'
import Layout from '../../components/Layout/Layout'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/Cart';
const CategoryProduct = () => {
    const navigate = useNavigate();
    const[product,setProduct] = useState([]);
    const[category,setCategory] = useState([]);
    const params = useParams()
    const [cart,setCart] = useCart();
    useEffect(()=>{
        if(params?.slug)
        getProductByCat();
    },[params?.slug])
    const getProductByCat = async()=>{
        try {
            const {data} = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
              );
            setProduct(data?.products);
            setCategory(data?.category);
        } catch (error) {
           // console.log(error);
        }
    }
    
  return (
    <Layout>
        <div className="container mt-3">
            <h4>Category:-{category?.name}</h4>
            <h6>Product:-{product?.length}</h6>
            <div className="d-flex flex-wrap Mypro-container Myflex" id="Myproduct">
            {/* {console.log("products while maping" + products.length)} */}
            {product?.map((p) => {
              return (
                <>
                  <div className="card m-2 Mypro" style={{ width: "18rem" }}>
                    <img
                      className="card-img-top"
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                    />
                    <div className="card-body">
                      <div className="Mytext Myflex">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="price">$ {p.price}</p>
                      </div>
                      {/* <p className="card-text">
                        {p.description.substring(0, 60)}
                      </p> */}
                      <div className="Mytext Myflex">
                      <button class="btn btn-primary m-1" onClick={()=>{
                        setCart([...cart,p])
                        localStorage.setItem("cart",JSON.stringify([...cart,p]));
                        alert("Item added to cart");
                      }}>Add to Cart</button>
                      <button
                        class="btn btn-secondary"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
    </Layout>
  )
}

export default CategoryProduct