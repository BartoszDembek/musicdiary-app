import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';;
import { SafeAreaView } from 'react-native-safe-area-context';
import EmailVerificationScreen from './screens/EmailVerificationScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './screens/MainScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{headerShown:false, sceneStyle: styles.screen,tabBarStyle:styles.screen,tabBarActiveTintColor:'#BB9AF7'}}>
      <Tab.Screen name="Home" component={LoginScreen} />
      <Tab.Screen name="Profile" component={RegisterScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: styles.screen }}>
            <Stack.Screen name="BottomTab" component={BottomTabNavigator} options={{headerShown:false}}/>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen:{
    backgroundColor: '#1E1E2E',
  }
});
