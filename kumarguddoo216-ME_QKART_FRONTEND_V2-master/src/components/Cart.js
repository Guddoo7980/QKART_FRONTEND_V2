import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
// import { useSnackbar } from "notistack";
import "./Cart.css";

/**
 * @typedef {Object} Product
 * @property {string} name
 * @property {string} category
 * @property {number} cost
 * @property {number} rating
 * @property {string} image
 * @property {string} _id
 */

/**
 * @typedef {Object} CartItem
 * @property {string} name
 * @property {number} qty
 * @property {string} category
 * @property {number} cost
 * @property {number} rating
 * @property {string} image
 * @property {string} productId
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 * @param { Array.<Product> } productsData
 * @returns { Array.<CartItem> }
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  if (!productsData || !Array.isArray(productsData) || productsData.length === 0) {
    return [];
  }

  return cartData.map((cartItem) => {
    const product = productsData.find(
      (product) => product._id === cartItem.productId
    );

    if (!product) {
      console.error(`Product with ID ${cartItem.productId} not found.`);
      return null;
    }

    return {
      name: product.name,
      qty: cartItem.qty,
      category: product.category,
      cost: product.cost,
      rating: product.rating,
      image: product.image,
      productId: product._id,
    };
  }).filter(Boolean);
};

/**
 * Get the total value of all products added to the cart
 * @param { Array.<CartItem> } items
 * @returns { Number }
 */
export const getTotalCartValue = (items = []) => {
  return items.reduce((total, item) => total + item.cost * item.qty, 0);
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * @param {Number} value
 * @param {Function} handleAdd
 * @param {Function} handleDelete
 * @param {Boolean} isReadOnly
 */
const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly }) => {
  return (
    <Stack direction="row" alignItems="center">
      {
        !isReadOnly && (<IconButton
          size="small"
          color="primary"
          onClick={handleDelete}
          disabled={isReadOnly}
        >
          <RemoveOutlined />
        </IconButton>)
      }
      <Box padding="0.5rem" data-testid="item-qty">
      {isReadOnly && "Qty: "}{value}
      </Box>
      {
        !isReadOnly && (<IconButton
          size="small"
          color="primary"
          onClick={handleAdd}
          disabled={isReadOnly}
        >
          <AddOutlined />
        </IconButton>)
      }
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * @param { Array.<Product> } products
 * @param { Array.<CartItem> } items
 * @param {Function} handleQuantity
 * @param {Boolean} isReadOnly
 */
const Cart = ({ isReadOnly, products, items = [], handleQuantity }) => {
  const history = useHistory();
  // const { enqueueSnackbar } = useSnackbar();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <Box className="cart">
      {items.map((item) => (
        <Box
          key={item.productId}
          display="flex"
          alignItems="flex-start"
          padding="1rem"
        >
          <Box className="image-container">
            <img src={item.image} alt={item.name} width="100%" height="100%" />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="6rem"
            paddingX="1rem"
          >
            <div>{item.name}</div>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <ItemQuantity
                value={item.qty}
                handleAdd={() => handleQuantity(item.productId, item.qty + 1)}
                handleDelete={() => handleQuantity(item.productId, item.qty - 1)}
                isReadOnly={isReadOnly}
              />
              <Box padding="0.5rem" fontWeight="700">
                ${item.cost}
              </Box>
            </Box>
          </Box>
        </Box>
      ))}

      <Box
        padding="1rem"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box color="#3C3C3C" alignSelf="center">
          Order total
        </Box>
        <Box
          color="#3C3C3C"
          fontWeight="700"
          fontSize="1.5rem"
          alignSelf="center"
          data-testid="cart-total"
        >
          ${getTotalCartValue(items)}
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" className="cart-footer">
        { (
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => {
              console.log("going to checkout")
              history.push("/checkout")
            }}
          >
            Checkout
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Cart;
