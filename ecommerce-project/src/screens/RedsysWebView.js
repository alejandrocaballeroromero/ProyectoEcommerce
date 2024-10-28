import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, Alert } from 'react-native';
import CryptoJS from 'crypto-js';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RedsysWebView = ({ route, navigation }) => {
  // Datos proporcionados para realizar pagos de prueba
  const merchantCode = '999008881';
  const terminal = '001';
  const secretKey = 'sq7HjrUOBfKmC576ILgskD5srU870gJ7'; // Clave secreta proporcionada por Redsys (Base64)

  // Datos del pedido recibidos desde la pantalla de la cesta
  const { cartItems, totalAmount } = route.params;

  // Crear un identificador de pedido único de 12 caracteres numéricos
  const order = '000000' + new Date().getTime().toString().slice(-6); // Identificador de pedido de 12 caracteres numéricos
  console.log('Order:', order);

  // Monto en céntimos (redondeado para evitar decimales)
  const amount = Math.round(totalAmount * 100).toString();
  console.log('Amount:', amount); // Debería mostrar el valor en céntimos sin decimales

  const currency = '978'; // Euro
  const transactionType = '0'; // Venta normal
  const merchantURL = 'myapp://PagoRespuesta';
  const urlOK = 'myapp://PagoExitoso';
  const urlKO = 'myapp://PagoFallido';

  // Generar los parámetros y la firma
  const params = {
    Ds_Merchant_Amount: amount,
    Ds_Merchant_Order: order,
    Ds_Merchant_MerchantCode: merchantCode,
    Ds_Merchant_Currency: currency,
    Ds_Merchant_Terminal: terminal,
    Ds_Merchant_TransactionType: transactionType,
    Ds_Merchant_MerchantURL: merchantURL,
    Ds_Merchant_UrlOK: urlOK,
    Ds_Merchant_UrlKO: urlKO,
  };

  const jsonParams = JSON.stringify(params);
  const encodedParams = base64.encode(jsonParams);

  const htmlContent = `
    <html>
      <body onload="document.forms[0].submit()">
        <form id="redsysPaymentForm" action="https://sis-t.redsys.es:25443/sis/realizarPago" method="POST">
          <input type="hidden" name="Ds_SignatureVersion" value="HMAC_SHA256_V1" />
          <input type="hidden" name="Ds_MerchantParameters" value="${encodedParams}" />
          <input type="hidden" name="Ds_Signature" value="sq7HjrUOBfKmC576ILgskD5srU870gJ7" />
        </form>
        <script type="text/javascript">
          document.getElementById('redsysPaymentForm').submit();
        </script>
      </body>
    </html>
  `;

  const clearCart = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const config = {
          headers: { Authorization: `Token ${token}` },
        };
        await axios.post('http://192.168.1.146:8000/api/cart/clear/', {}, config);
      }
    } catch (error) {
      console.log('Error al vaciar la cesta:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onNavigationStateChange={(event) => {
          if (event.url.includes('myapp://PagoExitoso')) {
            Alert.alert('Pago realizado con éxito');
            clearCart();
            navigation.navigate('PagoExitoso');
          } else if (event.url.includes('myapp://PagoFallido')) {
            Alert.alert('Pago fallido, inténtelo nuevamente');
            navigation.navigate('PagoFallido');
          } else if (event.url.includes('myapp://PagoRespuesta')) {
            navigation.navigate('PagoRespuesta');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RedsysWebView;
