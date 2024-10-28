import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { Formik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [isRegister, setIsRegister] = useState(false);
//hola mundofvbfgdhdbfthrasdw
  useEffect(() => {
    const checkToken = async () => {
      try { //iniciar sesion en varios sitios.
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          navigation.navigate('Home');
        }
      } catch (error) {
        console.log('Error verificando el token:', error);
      }
    };
    checkToken();
  }, []);

  const handleSubmit = async (values) => {
    try {
      console.log('Datos enviados:', values);
      const url = isRegister
        ? 'http://192.168.1.146:8000/api/accounts/register/'
        : 'http://192.168.1.146:8000/api/accounts/login/';
      const response = await axios.post(url, values);
      if (!isRegister) {
        await AsyncStorage.setItem('userToken', response.data.token);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log('Error completo:', error);
      let errorMessage = 'Error desconocido';
  
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = isRegister ? 'Registro fallido: Verifica los datos ingresados.' : 'Inicio de sesión fallido: Credenciales incorrectas.';
        } else if (error.response.status === 401) {
          errorMessage = 'No autorizado: Credenciales incorrectas.';
        } else if (error.response.status === 500) {
          errorMessage = 'Error del servidor: Inténtalo de nuevo más tarde.';
        }
      }
  
      alert(errorMessage);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</Text>
      <Formik
        initialValues={{ username: '', password: '', email: '' }}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <Text style={styles.label}>Nombre de usuario {isRegister ? '(Requerido para registro)' : ''}</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
            {isRegister && (
              <View>
                <Text style={styles.label}>Correo electrónico (Requerido para registro)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />
              </View>
            )}
            <Text style={styles.label}>Contraseña {isRegister ? '(Mínimo 8 caracteres, requerida para registro)' : ''}</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            <Button onPress={handleSubmit} title={isRegister ? 'Registrarse' : 'Iniciar Sesión'} />
            <Button
              onPress={() => setIsRegister(!isRegister)}
              title={isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;