import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PagoExitosoScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Pago realizado con éxito</Text>
      <Button title="Volver a Inicio" onPress={() => navigation.navigate('Home')} />
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

export default PagoExitosoScreen;
