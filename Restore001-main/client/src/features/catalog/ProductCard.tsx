import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Avatar,
  CardHeader,
  IconButton,
} from "@mui/material";
import { useStoreContext } from "../../app/context/StoreContext";
import { red } from "@mui/material/colors";
import { Product } from "../../app/models/Product";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/api/agent";


interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const {setBasket} = useStoreContext();

  function handleAddItem(productId : number) {
    setLoading(true);
    agent.Basket.addItem(productId)
    .then((basket) => setBasket(basket))
    .catch((error) => console.log(error))
    .finally(()=>setLoading(false))
  }

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {product.name.at(0)?.toUpperCase()}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={product.pictureUrl}
          subheader={product.name}
        />
        <CardMedia
          component="img"
          sx={{ height: "150", bgcolor: "#81CCF4", backgroundSize: "contain" }}
          image={product.pictureUrl}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {(product.price / 50).toFixed(2)} ฿
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.brand} / {product.type}
          </Typography>
        </CardContent>
        <CardActions>
          <LoadingButton
            size="small"
            loading={loading}
            onClick={() => handleAddItem(product.id)}
          >
            Add to Cart
          </LoadingButton>
          <Button component={Link} to={`/catalog/${product.id}`} size="small">
            VIEW
          </Button>
        </CardActions>
      </Card>
    </>
  );
}


