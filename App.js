import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import CustomDialog from './src/components/CustomDialog';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <CustomDialog />
        <StatusBar style="light" />
      </NavigationContainer>
    </AuthProvider>
  );
}
