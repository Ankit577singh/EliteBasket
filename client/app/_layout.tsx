import { Stack } from "expo-router";
import '@/global.css'
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Toast from "react-native-toast-message";
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
   
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <CartProvider>
          <WishlistProvider>
            <Stack screenOptions={{headerShown:false}} />
            <Toast/>
          </WishlistProvider>
        </CartProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  )
}
