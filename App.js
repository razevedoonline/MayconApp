import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
import VideoCallScreen from './src/screens/VideoCallScreen';
import VideoConferenceScreen from './src/screens/VideoConferenceScreen';
import DevicesScreen from './src/screens/DevicesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#F5F7FA' },
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
        <Stack.Screen name="VideoCall" component={VideoCallScreen} />
        <Stack.Screen name="VideoConference" component={VideoConferenceScreen} />
        <Stack.Screen name="Devices" component={DevicesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
      minHeight: '100dvh',
    }),
  },
});
