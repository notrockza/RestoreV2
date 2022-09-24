import React, { useEffect, useState } from "react";
import Header from "./Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";
import Catalog from "../../features/catalog/Catalog";
import { Route, Routes } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ProductDetails from "../../features/catalog/ProductDetails";
import NotFound from "../errors/NotFound";
import { ToastContainer } from "react-toastify";
import ServerError from "../errors/ServerError";
import agent from "../api/agent";
import { getCookie } from "../util/util";
import LoadingComponent from "./LoadingComponent";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { setBasket } from "../../features/basket/basketSlice";
import { statSync } from "fs";
// import { setBasket } from "../../features/basket/basketSlice";

export default function App() {
//const { setBasket } = useStoreContext(); //ควบคุมสเตทด้วย React context to Centralize
  const [loading, setLoading] = useState(true);

  const { fullscreen  } = useAppSelector( state => state.screen);
  const dispatch = useAppDispatch();

  useEffect(() => {
    //เอาข้อมูลใส่ใน COOKIE
    const buyerId = getCookie("buyerId");
    //หลักจากที่มีการ เปลียน state เเล้ว useEffect ก็จะทำงาน
    if (buyerId) {
      agent.Basket.get()
        .then((basket) => dispatch(setBasket(basket)))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, [dispatch]);

  const [mode, setMode] = useState(true);
  const displayMode = mode ? "light" : "dark";

  const darkTheme = createTheme({
    palette: {
      mode: displayMode,
    },
  });

  const handleMode = () => setMode(!mode);

  if (loading) return <LoadingComponent message="Initilize App....." />;

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <ToastContainer
          position="bottom-right"
          theme="colored"
          autoClose={600} />

        <CssBaseline />
        <Header handleMode={handleMode} />


      {fullscreen ? <Container sx={{ marginTop: 2 }}>{mainrouter}</Container> : <>{mainrouter}</>
        }
     
      </ThemeProvider>
    </>
  );
}

const mainrouter = <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="/catalog" element={<Catalog />} />
  <Route path="/basket" element={<BasketPage />} />
  <Route path="/catalog/:id" element={<ProductDetails />} />
  <Route path="/checkout" element={< CheckoutPage />} />
  <Route path="/server-error" element={<ServerError />} />
  <Route path="*" element={<NotFound />} />
</Routes>
