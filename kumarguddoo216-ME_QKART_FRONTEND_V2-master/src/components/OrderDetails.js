import {getTotalCartValue} from "./Cart"; 
import { Box } from "@mui/system"; 



const OrderDetails = ({items})=>{
    const totalCartValue = getTotalCartValue(items); 

    return (<Box display="flex" flexDirection="column" alignItems="flex-start"  padding="1rem" backgroundColor= "#ffffff" borderRadius="4px" margin="0.5rem">
        
       <h1>Order Details</h1>

       <Box display="flex" width="100%" marginBottom="10px" justifyContent="space-between">
            <div>Products</div>
            <div>{items.length}</div>
        </Box>
       <Box display="flex" width="100%" marginBottom="10px"  justifyContent="space-between">
            <div>Subtotal</div>
            <div>${totalCartValue}</div>
        </Box>
       <Box display="flex" width="100%" marginBottom="10px"  justifyContent="space-between">
            <div>Shipping Charges</div>
            <div>$0</div>
        </Box>
       <Box display="flex" width="100%" justifyContent="space-between">
            <h3>Total</h3>
            <h3>${totalCartValue}</h3>
        </Box>

    </Box>)
}

export default OrderDetails; 
