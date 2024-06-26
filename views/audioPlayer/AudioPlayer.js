import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { TextComponent } from "../../components/TextComponent";
import { ViewComponent } from "../../components/ViewComponent";
import { Ionicons } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";
const AudioPlayer = ({ route }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const { book } = route.params;
  useEffect(() => {
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadSound = async () => {
    const { sound, status } = await Audio.Sound.createAsync(
      require("../../assets/muzik.mp3"),
      { shouldPlay: isPlaying }
    );
    setSound(sound);
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    setDurationMillis(status.durationMillis);
  };

  const onPlaybackStatusUpdate = (status) => {
    setPositionMillis(status.positionMillis);
  };

  const toggleSound = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const skipBackward = async () => {
    const newPosition = Math.max(0, positionMillis - 10000); // 10 saniye geri al
    await sound.setPositionAsync(newPosition);
  };

  const skipForward = async () => {
    const newPosition = Math.min(
      durationMillis,
      positionMillis + 10000 // 10 saniye ileri al
    );
    await sound.setPositionAsync(newPosition);
  };
  const changeSlider = async (value) => {
    const newPosition = value * durationMillis;
    setPositionMillis(newPosition);
    await sound.setPositionAsync(newPosition);
  };
  const formatTime = (timeMillis) => {
    const minutes = Math.floor(timeMillis / 60000);
    const seconds = ((timeMillis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  let sliderValue =
    (positionMillis / durationMillis) * 100
      ? ((positionMillis / durationMillis) * 100) / 100
      : 0;
  return (
    <ViewComponent style={{ paddingBottom: 30 }}>
      <View style={styles.card}>
        <Image source={book.path} style={styles.avatar} />
        <TextComponent>{book.name}</TextComponent>
        <TextComponent style={styles.span}>{book.author}</TextComponent>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <Slider value={sliderValue} onValueChange={(v) => changeSlider(v)} />
          <View style={styles.indicatorContainer}>
            <TextComponent>{formatTime(positionMillis)}</TextComponent>
            <TextComponent>{formatTime(durationMillis)}</TextComponent>
          </View>
        </View>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={skipBackward}>
          <Ionicons name="play-back-circle" size={40} color="#D45555" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSound}>
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={50}
            color={"#D45555"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipForward}>
          <Ionicons name="play-forward-circle" size={40} color="#D45555" />
        </TouchableOpacity>
      </View>
    </ViewComponent>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  avatar: {
    width: "90%",
    height: "80%",
    borderRadius: 20,
  },
  card: {
    flex: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarContainer: {
    width: "80%",
    alignSelf: "center",
  },
  progressBar: {
    width: "100%",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    position: "absolute",
    top: -20,
    width: "100%",
  },
  span: {
    fontSize: 10,
    color: "#888", // or any desired light color
    fontWeight: "300", // normal or light font weight
  },
});
