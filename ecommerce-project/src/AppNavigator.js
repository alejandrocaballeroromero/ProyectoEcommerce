import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProductListScreen from './screens/ProductListScreen';
import CartScreen from './screens/CartScreen';
import RedsysWebView from './screens/RedsysWebView';
import PagoExitosoScreen from './screens/PagoExitosoScreen';
import PagoFallidoScreen from './screens/PagoFallidoScreen';
import PagoRespuestaScreen from './screens/PagoRespuestaScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="RedsysWebView" component={RedsysWebView} />
      <Stack.Screen name="PagoExitoso" component={PagoExitosoScreen} />
      <Stack.Screen name="PagoFallido" component={PagoFallidoScreen} />
      <Stack.Screen name="PagoRespuesta" component={PagoRespuestaScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
