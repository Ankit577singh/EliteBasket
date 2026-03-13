import { dummyCart } from "@/assets/assets";
import { Product } from "@/constants/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type CartItem = {
    id: string;
    productId: string;
    product: Product;
    quantity: number;
    size: string;
    price: number;
};

type CartContextType = {
    cartItems: CartItem[],
    addToCart: (product: Product, size: string) => Promise<void>;
    removeFromCart: (itemId: string, size: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number, size: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartTotal: number;
    itemCount: number;
    isLoading: boolean;
};



const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);

    const fetchCart = async () => {
        setIsLoading(true);
        const serverCart = dummyCart;
        const mappedItems: CartItem[] = serverCart.items.map((item: any) => ({
            id: item._id,
            productId: item.product._id,
            product: item.product,
            quantity: item.quantity,
            size: item?.size || 'M',
            price: item.price
        }));
        setCartItems(mappedItems);
        setCartTotal(serverCart.totalAmount);
        setIsLoading(false);
    };

    const addToCart = async (product: Product, size: string) => {
        // Implementation for adding to cart
        // setIsLoading(true);
        // try {
        //     // Check if item already exists in cart with same size
        //     const existingItemIndex = cartItems.findIndex(
        //         item => item.productId === product._id && item.size === size
        //     );

        //     if (existingItemIndex >= 0) {
        //         // Update quantity if item exists
        //         const updatedItems = [...cartItems];
        //         updatedItems[existingItemIndex].quantity += 1;
        //         setCartItems(updatedItems);
                
        //         // Update total
        //         const newTotal = cartTotal + product.price;
        //         setCartTotal(newTotal);
        //     } else {
        //         // Add new item
        //         const newItem: CartItem = {
        //             id: product._id,
        //             productId: product._id,
        //             product: product,
        //             quantity: 1,
        //             size: size,
        //             price: product.price
        //         };
        //         setCartItems([...cartItems, newItem]);
        //         setCartTotal(cartTotal + product.price);
        //     }
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const removeFromCart = async (productId: string, size: string) => {
        // setIsLoading(true);
        // try {
        //     const itemToRemove = cartItems.find(
        //         item => item.productId === productId && item.size === size
        //     );
            
        //     if (itemToRemove) {
        //         setCartItems(cartItems.filter(
        //             item => !(item.productId === productId && item.size === size)
        //         ));
        //         setCartTotal(cartTotal - (itemToRemove.price * itemToRemove.quantity));
        //     }
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const updateQuantity = async (productId: string, quantity: number, size: string = "M") => {
        // setIsLoading(true);
        // try {
        //     const itemIndex = cartItems.findIndex(
        //         item => item.productId === productId && item.size === size
        //     );

        //     if (itemIndex >= 0) {
        //         const oldQuantity = cartItems[itemIndex].quantity;
        //         const updatedItems = [...cartItems];
        //         updatedItems[itemIndex].quantity = quantity;
        //         setCartItems(updatedItems);

        //         // Update total
        //         const pricePerItem = cartItems[itemIndex].price;
        //         setCartTotal(cartTotal + (pricePerItem * (quantity - oldQuantity)));
        //     }
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const clearCart = async () => {
        // setIsLoading(true);
        // try {
        //     setCartItems([]);
        //     setCartTotal(0);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider
            value={{ 
                cartItems, 
                addToCart, 
                removeFromCart, 
                updateQuantity,
                clearCart, 
                cartTotal, 
                itemCount, 
                isLoading 
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}