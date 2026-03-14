import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { CartItemProps } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const imageUrl = item.product.images?.[0] ?? '';

  return (
    <View className='flex-row mb-4 bg-white p-3 rounded-xl shadow-sm'>
      {/* Product Image */}
      <View className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-3'>
        <Image 
          source={{ uri: imageUrl }} 
          className='w-full h-full' 
          resizeMode="cover"
        />
      </View>

      {/* Product Details */}
      <View className='flex-1 justify-between'>
        {/* Product info and remove button */}
        <View className='flex-row justify-between items-start'>
          <View>
            <Text className='text-primary font-medium text-sm mb-1'>{item.product.name}</Text>
            <Text className='text-secondary text-xs'>Size: {item.size}</Text>
          </View>
          <TouchableOpacity 
            onPress={onRemove}
            className='p-1'
          >
            <Ionicons name="close-circle-outline" size={20} color="#FF4C3B" />
          </TouchableOpacity>
        </View>

        {/* Price and quantity controls */}
        <View className='flex-row justify-between items-center mt-2'>
          <Text className='text-primary font-bold'>${item.product.price.toFixed(2)}</Text>
          
          {/* Quantity Controls */}
          <View className='flex-row items-center border border-gray-200 rounded-lg'>
            <TouchableOpacity 
              onPress={() => onUpdateQuantity && onUpdateQuantity(item.quantity - 1)}
              className='px-3 py-1'
              disabled={item.quantity <= 1}
            >
             <Ionicons name='remove' size={16} color={COLORS.primary}/>
            </TouchableOpacity>
            
            <Text className='px-3 py-1 text-primary font-medium'>{item.quantity}</Text>
            
            <TouchableOpacity 
              onPress={() => onUpdateQuantity && onUpdateQuantity(item.quantity + 1)}
              className='px-3 py-1'
            >
            <Ionicons name='add' size={16} color={COLORS.primary}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}