import Grid from "@mui/material/Grid";
import { Product } from "../../app/models/Product";
import { useAppSelector } from "../../app/store/configureStore";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
  product: Product[];
}

export default function ProductList(props: Props) {
  const { productsLoaded } = useAppSelector((state) => state.catalog);
  return (
    <>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {props.product.map((product: any) => (
          <Grid item xs={4} sm={4} md={4} key={product.id}>
                {!productsLoaded ? (
              <ProductCardSkeleton />
            ) : (
              <ProductCard product={product} />
            )}

          </Grid>
        ))}
      </Grid>
    </>
  );
}
