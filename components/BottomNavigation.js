import React, { useState, useEffect } from "react";
import Home from "../views/Home";
import { NavigationContainer } from "@react-navigation/native";
import useTheme from "../hooks/useTheme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ReadBook from "../views/readBook/ReadBook";
import Settings from "../views/settings/Settings";
import { Image, StyleSheet, Button, Text } from "react-native";
import FavoriteBooks from "../views/favorite/FavoriteBooks";
import AudioPlayer from "../views/audioPlayer/AudioPlayer";
import { createStackNavigator } from "@react-navigation/stack";
import TopBanner from "./topBanner/TopBanner";
import HomeTopBanner from "./topBanner/HomeTopBanner";
import BookDetail from "../views/bookDetail/BookDetail";
import Login from "../views/login/Login";
import { useGlobalState } from "../context/GlobalStateContext";
import Register from "../views/login/Register";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

export const StackNavigator = () => {
  const { isAuthenticated } = useGlobalState();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="BottomNavigation"
              component={BottomNavigation}
              options={{
                header: HomeTopBanner,
              }}
            />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen
              name="ReadBook"
              component={ReadBook}
              options={{
                header: TopBanner,
              }}
            />
            <Stack.Screen
              name="AudioPlayer"
              component={AudioPlayer}
              options={{
                header: TopBanner,
              }}
            />
            <Stack.Screen
              name="BookDetail"
              component={BookDetail}
              options={{
                header: TopBanner,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                header: HomeTopBanner,
              }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                header: HomeTopBanner,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function BottomNavigation() {
  const { getTheme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "FavoriteBooks") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "ReadBook") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Profile") {
            return (
              <Image
                source={{ uri: "https://i.pravatar.cc/200" }}
                style={{
                  ...styles.avatar,
                  borderWidth: focused ? 2 : undefined,
                  borderColor: focused ? "#D45555" : undefined,
                }}
              />
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false, // Label'ı kaldır
        headerShown: false, // Ekran başlığını ve geri düğmesini gizler
        tabBarStyle: {
          backgroundColor: getTheme().bottomNavigation, // Arka plan rengi
        },
        tabBarActiveTintColor: "#F38181",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="FavoriteBooks" component={FavoriteBooks} />
      <Tab.Screen name="Profile" component={Settings} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
