import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '@/components/header'
import ProductCard from '@/components/ProductCard'
import { useWishlist } from '@/context/WishlistContext'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Favorites() {
    const router = useRouter();
    const { wishlist } = useWishlist();

    return (
        <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
            <Header title='Wishlist' showBack showCart />
            
            {wishlist.length > 0 ? (
                <ScrollView 
                    className='flex-1 px-4 mt-4' 
                    showsVerticalScrollIndicator={false}
                >
                    <View className='flex-row flex-wrap justify-between'>
                        {wishlist.map((product) => (
                            <ProductCard
                                key={product._id} 
                                product={product} 
                            />
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View className='flex-1 items-center justify-center px-4'>
                    <Text className='text-secondary text-lg text-center mb-4'>
                        Your wishlist is empty
                    </Text>
                    <TouchableOpacity 
                        onPress={() => router.push('/')}
                        className='mt-2'
                    >
                        <Text className='text-primary font-bold text-lg'>
                            Start Shopping
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}