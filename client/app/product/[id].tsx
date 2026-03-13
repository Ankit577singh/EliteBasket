import { View, Text, SafeAreaView, ScrollView, Image, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';
import Toast from 'react-native-toast-message';
import { dummyProducts } from '@/assets/assets';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
// import { Product } from '@/constants/types';
import { Product } from '@/constants/types';

const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, itemCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

//   const fetchProduct = async () => {
//     // Replace with your actual product fetching logic
//     setProduct(dummyProducts.find((Product) => product?._id === id) as any);
//     setLoading(false);
//   };

const fetchProduct = async () => {
  const foundProduct = dummyProducts.find((product) => product._id === id);
  setProduct(foundProduct || null);
  setLoading(false);
};

  useEffect(() => {
    fetchProduct();
  }, []);

  const isLiked = product ? isInWishlist(product._id) : false;

  const handleAddToCart = () => {
    if (!selectedSize) {
      Toast.show({
        type: 'info',
        text1: 'No Size Selected',
        text2: 'Please select a size'
      });
      return;
    }
    addToCart(product , selectedSize || '');
  };

  if (loading) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center'>
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className='flex-1 bg-white'>
      {/* Header Actions */}
      <View className='absolute top-12 left-4 right-4 flex-row justify-between items-center z-10'>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className='w-10 h-10 bg-white/80 rounded-full items-center justify-center'
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => toggleWishlist(product)} 
          className='w-10 h-10 bg-white/80 rounded-full items-center justify-center'
        >
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? COLORS.accent : COLORS.primary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Carousel */}
        <View className='relative h-[450px] bg-gray-100 mb-6'>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const slide = Math.ceil(
                e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
              );
              setActiveImageIndex(slide);
            }}
          >
            {product.images?.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{ width: width, height: 450 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Image Pagination Dots */}
          {product.images?.length > 1 && (
            <View className='absolute bottom-4 left-0 right-0 flex-row justify-center'>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    activeImageIndex === index ? 'bg-primary' : 'bg-gray-400'
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="px-5">
          {/* Title & Rating */}
          <View className='flex-row justify-between items-start mb-2'>
            <Text className='text-2xl font-bold text-primary flex-1 mr-4'>
              {product.name}
            </Text>
            <View className='flex-row items-center'>
              <Ionicons name='star' size={16} color="#FFD700" />
              <Text className='text-sm font-medium ml-1'>4.6</Text>
              <Text className='text-xs text-secondary ml-1'>(85)</Text>
            </View>
          </View>

          {/* Price */}
          <Text className='text-2xl font-bold text-primary mb-6'>
            ${product.price?.toFixed(2)}
          </Text>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <>
              <Text className='text-base font-semibold text-primary mb-3'>
                Size
              </Text>
              <View className='flex-row gap-3 mb-6 flex-wrap'>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full items-center justify-center border ${
                      selectedSize === size 
                        ? 'bg-primary border-primary' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedSize === size ? 'text-white' : 'text-primary'
                      }`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Description */}
          <Text className='text-base font-semibold text-primary mb-2'>
            Description
          </Text>
          <Text className='text-secondary leading-6 mb-6'>
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className='absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex-row'>
        <TouchableOpacity 
          onPress={handleAddToCart}
          className='w-4/5 bg-primary py-4 rounded-full items-center shadow-lg flex-row justify-center'
        >
          <Ionicons name="bag-outline" size={20} color="white" />
          <Text className='text-white font-bold text-base ml-2'>Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push("/(tabs)/cart")} 
          className='w-1/5 py-3 flex-row justify-center relative'
        >
          <Ionicons name="cart-outline" size={24} color={COLORS.primary} />
          {itemCount > 0 && (
            <View className='absolute top-0 right-4 h-5 w-5 bg-black rounded-full justify-center items-center'>
              <Text className='text-white text-[10px] font-bold'>
                {itemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}