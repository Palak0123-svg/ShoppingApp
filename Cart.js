import React, {useEffect,useState} from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/Auth";
import { useCart } from "../context/Cart";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
const Cart = () => {
  const navigate = useNavigate();
  const [cart,setCart] = useCart();
  const [auth, setAuth] = useAuth();
  //payment
  const[clientToken,setClientToken]=useState("")
  const[instance,setInstance] = useState(); // instanse milta h braintree ke pakgage se
  const[loading,setLoading] = useState(false)
  // total price
  const totalPrice = ()=>{
    try {
      let total =0;
      cart?.map((item)=>{total = total +item.price})
      return total.toLocaleString("en-US",{style:"currency",
      currency:"USD"
    });
    } catch (error) {
      console.log(error);
      
    }
  }
  // delete item
  const removeCartItem = async(pid)=>{
    try {
      let mycart = [...cart];
      let index = mycart.findIndex((item)=>item._id===pid);
      mycart.splice(index,1);
      setCart(mycart);
      localStorage.setItem('cart',JSON.stringify(mycart))
    } catch (error) {
      console.log(error);
      
    }
  }
  // get payment gateway token
  const getToken = async () =>{
    try {
      const{data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`)
      setClientToken(data?.clientToken)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getToken();
    },[auth?.token]);

  const handlePayment = async() => {
    try {
       setLoading(true);
      const{nonce} = await instance.requestPaymentMethod();
      const{data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,{nonce,cart});
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders")
      alert("payment completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div  className="mt-1">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {
                cart?.length ? `you have ${cart.length} items in your cart ${auth?.token? "":"please login to checkout"}` : "your cart is empty"
              }
            </h4>
          </div>
        </div>
        <div className="row m-2">
          <div className="col-md-7">
            {
              cart?.map((p)=>(
                <div className="row card flex-row">
                  <div className="col-md-4">
                  <img
                      className="card-img-top"
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      // width={"50px"}
                      height={"120px"}
                    />
                  </div>
                  <div className="col-md-6">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0,30)}</p>
                    <p>Price:{p.price}</p>
                    <button className="btn btn-danger" onClick={()=>removeCartItem(p._id)}>
                      Remove
                    </button>
                  </div>
                </div>
                ))
            }
          </div>
          <div className="col-md-5 text-center">
           <h4>Cart Summary</h4>
           <p>Total | CheckOut | payment</p>
           <hr />
           <h4>Total:{totalPrice()}</h4>
           {auth?.user?.address?(<>
           <div className="mb-3">
            <h4>Current Address</h4>
            <h5>{auth?.user?.address}</h5>
            <button className="btn btn-outline-warning" onClick={()=>navigate(`/dashboard/user/profile`)}>Update Address</button>
           </div>
           </>):(
            <div className="mb-3">
              {
                auth?.token ? (
                  <button className="btn btn-outline-warning" onClick={()=>navigate(`/dashboard/user/profile`)}>Update Address</button>
                ):(
                  <button className="btn btn-outline-warning" onClick={()=>navigate(`/login`,{state:'/cart'})}>Please Login to checkOut</button>
                )
              }
            </div>
           )}
            <div className="mt-2">
              {!clientToken || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing ...." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
