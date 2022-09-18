import Grid from "@mui/material/Grid";
import { Product } from "../../app/models/Product";
import ProductCard from "./ProductCard";

interface Props {
  product: Product[];
}

export default function ProductList(props: Props) {
  return (
    <>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {props.product.map((product: any) => (
          <Grid item xs={4} sm={4} md={4} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
