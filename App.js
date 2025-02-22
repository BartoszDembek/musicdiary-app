import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './screens/MainScreen';
import AlbumScreen from './screens/AlbumScreen';
import ArtistScreen from './screens/ArtistScreen';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Create a stack navigator for the home tab
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="Album" component={AlbumScreen} />
      <Stack.Screen name="Artist" component={ArtistScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.screen,
        tabBarActiveTintColor: '#BB9AF7',
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Home' ? 'grid' : 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={RegisterScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="light" backgroundColor="#1E1E2E" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E',
  },
  screen: {
    backgroundColor: '#1E1E2E',
    borderTopColor: '#414868',
    borderTopWidth: 1,
  }
});
