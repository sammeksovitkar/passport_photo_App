// CropScreen.js
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ImageCropper from 'expo-image-cropper';

export default function CropScreen({ route, navigation }) {
  const { imageUri, onCropComplete } = route.params;

  return (
    <View style={styles.container}>
      <ImageCropper
        imageUri={imageUri}
        onSuccessfulCrop={(uri) => {
          onCropComplete(uri);  // send back cropped image
          navigation.goBack();
        }}
        onCancel={() => navigation.goBack()}
        fixedAspectRatio={false}  // <-- Allows freeform cropping
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
