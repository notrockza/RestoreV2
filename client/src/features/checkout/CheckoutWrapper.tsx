import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import agent from '../../app/api/agent';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { PrivateRoute } from '../../app/layout/PrivateRoute';
import { useAppDispatch } from '../../app/store/configureStore';
import { setBasket } from '../basket/basketSlice';
import ContactPage from '../contact/ContactPage';
import OrderPage from '../orders/OrderPage';
import CheckoutPage from './CheckoutPage';
 
//public key from stripe
const stripePromise = loadStripe('pk_test_51Lq9u3BxX0j6CsX2J0qPHPN87tGLiWrN4l0cvA0sWtIF7aP2UdeUZzEfPuM6PXS38VdvLtTUgJYnq4TtEGJnjY9v00rH3nAygn')
 
export default function CheckoutWrapper() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    //สร้างหรืออัพเดทใบสั่งซื้อส่งไปยัง Stripe (incomplete)  
    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then(basket => dispatch(setBasket(basket)))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [dispatch]);

    if (loading) return <LoadingComponent message='Loading checkout...' />
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  )
}
 

<Route element={<PrivateRoute />}>
    <Route path="/checkout" element={<CheckoutWrapper/>} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/orders" element={<OrderPage/>}/>
</Route>
