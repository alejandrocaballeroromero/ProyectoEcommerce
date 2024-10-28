import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la página principal</Text>
      <Button title="Ir a Lista de Productos" onPress={() => navigation.navigate('ProductList')} />
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen;