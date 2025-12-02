import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import MyAppointmentsScreen from './src/screens/MyAppointmentsScreen';
import MedicalRecordsScreen from './src/screens/MedicalRecordsScreen';
import ExamsScreen from './src/screens/ExamsScreen';
import PrescriptionsScreen from './src/screens/PrescriptionsScreen';
import PharmacyScreen from './src/screens/PharmacyScreen';
import SymptomsScreen from './src/screens/SymptomsScreen';
import HealthScreen from './src/screens/HealthScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} />
        <Stack.Screen name="MedicalRecords" component={MedicalRecordsScreen} />
        <Stack.Screen name="Exams" component={ExamsScreen} />
        <Stack.Screen name="Prescriptions" component={PrescriptionsScreen} />
        <Stack.Screen name="Pharmacy" component={PharmacyScreen} />
        <Stack.Screen name="Symptoms" component={SymptomsScreen} />
        <Stack.Screen name="Health" component={HealthScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
