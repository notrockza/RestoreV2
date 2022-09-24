import axios from "axios";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/Product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";

export default function Catalog() {
  // อ่านข้อมูลทั้งหมด productSelectors.selectAll 
  // เป็นตัวเเปรเเบบ Adapter
  const products = useAppSelector(productSelectors.selectAll)
  const {productsLoaded,status} = useAppSelector(state=>state.catalog)
  const dispatch = useAppDispatch()
 
  useEffect(() => {
    // ถ้า productsLoaded มีการโหลด จะทำการ reset
    if(!productsLoaded) dispatch(fetchProductsAsync())
  }, [productsLoaded, dispatch]);
 
  if(status.includes('pending')) return <LoadingComponent message="Loading Products..."/>



  return (
    <>
      <ProductList product={products} />
    </>
  );
}
