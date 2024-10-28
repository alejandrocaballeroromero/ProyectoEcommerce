import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PagoRespuestaScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Procesando respuesta del pago...</Text>
      {/* Aquí se podría añadir lógica adicional para procesar la respuesta del pago si es necesario */}
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

export default PagoRespuestaScreen;
