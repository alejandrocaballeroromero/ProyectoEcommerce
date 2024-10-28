import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.1.146:8000/api/store/products/');
        setProducts(response.data);
      } catch (error) {
        console.log('Error al obtener los productos:', error);
      }
    };

    const fetchCartItemCount = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const config = {
          headers: { Authorization: `Token ${token}` },
        };
        const response = await axios.get('http://192.168.1.146:8000/api/store/cart/', config);
        const items = response.data.items;
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalCount > 9 ? '9+' : totalCount);
      } catch (error) {
        console.log('Error al obtener la cantidad de artículos en la cesta:', error);
      }
    };

    fetchProducts();
    fetchCartItemCount();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert('Debes iniciar sesión para agregar productos a la cesta.');
        return;
      }

      const config = {
        headers: { Authorization: `Token ${token}` },
      };
      await axios.post('http://192.168.1.146:8000/api/store/cart/', { product_id: productId }, config);
      alert('Producto añadido a la cesta con éxito');
      setCartItemCount((prevCount) => (prevCount === '9+' ? '9+' : Math.min(prevCount + 1, 9)));
    } catch (error) {
      console.log('Error al añadir el producto a la cesta:', error);
      if (error.response?.status === 401) {
        alert('No autorizado: Por favor, inicia sesión nuevamente.');
      } else {
        alert('Error al añadir el producto a la cesta. Por favor, inténtalo más tarde.');
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>Precio: ${parseFloat(item.price).toFixed(2)}</Text>
      <Button title="Comprar" onPress={() => handleAddToCart(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Productos</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.cartButtonText}>Cesta ({cartItemCount})</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  productContainer: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    marginBottom: 8,
  },
  cartButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#ff6347',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ProductListScreen;