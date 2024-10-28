import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const config = {
          headers: { Authorization: `Token ${token}` },
        };
        const response = await axios.get('http://192.168.1.146:8000/api/store/cart/', config);
        setCart(response.data.items);
        calculateTotal(response.data.items);
      } catch (error) {
        console.log('Error al obtener los artículos de la cesta:', error);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setTotalAmount(total);
  };

  const updateCartItemQuantity = async (productId, change) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const config = {
        headers: { Authorization: `Token ${token}` },
      };
      const updatedCart = cart.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + change;
          if (newQuantity > 0) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      }).filter(item => item.quantity > 0);
      setCart(updatedCart);
      calculateTotal(updatedCart);

      await axios.post('http://192.168.1.146:8000/api/store/cart/', { product_id: productId, quantity: change }, config);
    } catch (error) {
      console.log('Error al actualizar la cantidad del artículo en la cesta:', error);
    }
  };

  const handlePayment = () => {
    navigation.navigate('RedsysWebView', { cartItems: cart, totalAmount });
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Text style={styles.productName}>{item.product.name}</Text>
      <Text style={styles.productPrice}>Precio: ${parseFloat(item.product.price).toFixed(2)}</Text>
      <Text style={styles.quantity}>Cantidad: {item.quantity}</Text>
      <View style={styles.quantityButtons}>
        <Button title="+" onPress={() => updateCartItemQuantity(item.product.id, 1)} />
        <Button title="-" onPress={() => updateCartItemQuantity(item.product.id, -1)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cesta de Compra</Text>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.product.id.toString()}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total a pagar: ${totalAmount.toFixed(2)}</Text>
        <Button title="Pagar" onPress={handlePayment} />
      </View>
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
  quantity: {
    fontSize: 16,
    marginBottom: 8,
  },
  quantityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  totalContainer: {
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderColor: 'gray',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default CartScreen;