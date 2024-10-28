import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PagoFallidoScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Pago fallido, inténtelo nuevamente</Text>
      <Button title="Volver a la Cesta" onPress={() => navigation.navigate('Cart')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PagoFallidoScreen;
