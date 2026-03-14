import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import { useCart } from '@/context/CartContext'

export default function TabLayout() {
     const { cartItems } = useCart()

  return (
   <Tabs screenOptions={{
        headerShown : false,
        tabBarActiveTintColor: COLORS.primary,
   }}>
        <Tabs.Screen 
            name = 'index'
            options={{
                tabBarIcon : ({color , focused})=>(
                    <Ionicons
                        name= {focused ? "home" : "home-outline"}
                        size ={26}
                        color = {color}
                    />
                )
            }}
        />
        <Tabs.Screen 
            name="cart"
           options={{
          tabBarIcon: ({ color, focused }) => (
            <View className='relative'>
              <Feather
                name='shopping-cart' 
                size={26} 
                color={color}
              />
              {cartItems?.length > 0 && (
                <View className='absolute -top-1 -right-2 bg-accent w-4 h-4 rounded-full items-center justify-center'>
                  <Text className='text-white text-xs font-bold'>
                    {cartItems.length > 9 ? '9+' : cartItems.length}
                  </Text>
                </View>
              )}
            </View>
          )
        }}
        />
        <Tabs.Screen 
            name="favorites"
            options={{ 
                tabBarIcon: ({ color, focused }) => (
                <Ionicons
                    name={focused ? "heart" : "heart-outline"}
                    size={26}
                    color={color}
                />
                )
            }}
        />
        <Tabs.Screen 
            name="profile"
            options={{ 
                tabBarIcon: ({ color, focused }) => (
                <Ionicons
                    name={focused ? "person" : "person-outline"}
                    size={26}
                    color={color}
                />
                )
            }}
        />
   </Tabs>
  )
}