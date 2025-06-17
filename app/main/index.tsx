import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button";
import { handleError } from "../sentry/handleError";

export default function LandingScreen() {
  const redirectToSignIn = () => {
    router.push("/auth/sign-in");
    throw new Error("error example");
  };

  const redirectToSignUp = () => router.push("/auth/register/step1-user-info");

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />{" "}
      <Text style={styles.slogan}>Planifiez moins, vivez plus.</Text>
      <Button
        title="Connexion"
        onPress={() => handleError(redirectToSignIn)}
        style={{ width: "90%" }}
      />
      <Button
        title="S'inscrire"
        variant="secondary"
        onPress={() => handleError(redirectToSignUp)}
        style={{ width: "90%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  slogan: {
    fontSize: 16,
    color: "#333",
    marginBottom: 40,
    textAlign: "center",
  },
});
