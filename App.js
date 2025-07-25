// App.js
import React, { useState, useRef } from 'react';
import {
  View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import Slider from '@react-native-community/slider';

const layoutOptions = [
  { label: '9 Photos (4x6)', value: '4x6_9' },
  { label: 'Full Image on A4', value: 'a4' },
  { label: 'PVC Card (4x6)', value: 'pvc' },
  { label: '6 Passport (2x2 inch)', value: '2x2_6' },
  { label: 'Multi A4 (2/4/6/9/12)', value: 'multi_a4' },
  { label: 'Aadhar Card (Top & Bottom)', value: 'aadhar' },
];

const photoCounts = [2, 4, 6, 9, 12];

export default function App() {
  const [image, setImage] = useState(null);
  const [brightImage, setBrightImage] = useState(null);
  const [layout, setLayout] = useState('4x6_9');
  const [brightness, setBrightness] = useState(1);
  const [multiCount, setMultiCount] = useState(4);
  const [multiImages, setMultiImages] = useState([]);
  const [aadharImageTop, setAadharImageTop] = useState(null);
  const [aadharImageBottom, setAadharImageBottom] = useState(null);
  const layoutRef = useRef();

  const pickImage = async () => {
    if (layout === 'multi_a4') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: multiCount,
      });

      if (!result.canceled) {
        const uris = result.assets.map((asset) => asset.uri);
        setMultiImages(uris.slice(0, multiCount));
      }

    } else if (layout === 'aadhar') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 2,
        quality: 1,
      });

      if (!result.canceled && result.assets.length >= 1) {
        setAadharImageTop(result.assets[0].uri);
        setAadharImageBottom(result.assets[1]?.uri || result.assets[0].uri);
      }

    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        const cropped = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );

        setImage(cropped.uri);
        setBrightImage(cropped.uri);
        setBrightness(1);
      }
    }
  };

  const shareLayout = async () => {
    try {
      const uri = await captureRef(layoutRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
        width: 1200,
        height: 1700,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const renderLayout = () => {
    if ((layout === 'multi_a4' && multiImages.length === 0) || (layout === 'aadhar' && (!aadharImageTop || !aadharImageBottom))) return null;
    if (layout !== 'multi_a4' && layout !== 'aadhar' && !brightImage) return null;

    switch (layout) {
      case '4x6_9':
        return (
          <View style={styles.layoutContainer} ref={layoutRef} collapsable={false}>
            {[...Array(9)].map((_, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: brightImage }} style={[styles.photo, { opacity: brightness }]} />
              </View>
            ))}
          </View>
        );
      case 'a4':
        return (
          <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
            <Image source={{ uri: brightImage }} style={[styles.fullA4Photo, { opacity: brightness }]} />
          </View>
        );
      case 'pvc':
        return (
          <View style={styles.layoutContainer} ref={layoutRef} collapsable={false}>
            <View style={styles.pvcWrapper}>
              <Image source={{ uri: brightImage }} style={[styles.pvcPhoto, { opacity: brightness }]} />
            </View>
          </View>
        );
      case '2x2_6':
        return (
          <View style={styles.layoutContainer} ref={layoutRef} collapsable={false}>
            {[...Array(6)].map((_, index) => (
              <View key={index} style={styles.passportWrapper}>
                <Image source={{ uri: brightImage }} style={[styles.passportPhoto, { opacity: brightness }]} />
              </View>
            ))}
          </View>
        );
      case 'multi_a4':
        return (
          <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
            <View style={styles.multiPhotoGrid}>
              {multiImages.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={{
                    width: 170,
                    height: 180,
                    resizeMode: 'cover',
                    margin: 6,
                    borderWidth: 1,
                    borderColor: '#ccc',
                  }}
                />
              ))}
            </View>
          </View>
        );
      case 'aadhar':
  return (
    <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
      <View style={{ marginBottom: 10 }}>
        <Image source={{ uri: aadharImageTop }} style={{ width: 320, height: 190, resizeMode: 'cover', borderWidth: 1, borderColor: '#000' }} />
      </View>
      <View>
        <Image source={{ uri: aadharImageBottom }} style={{ width: 320, height: 190, resizeMode: 'cover', borderWidth: 1, borderColor: '#000' }} />
      </View>
    </View>
  );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4f7' }}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 100 }]}>
        <Text style={styles.title}>📸 Passport Photo Print App</Text>

        <Button title="Select Photo(s)" onPress={pickImage} />

        <View style={styles.optionsContainer}>
          {layoutOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.optionBtn, layout === opt.value && styles.selectedBtn]}
              onPress={() => {
                setLayout(opt.value);
                setImage(null);
                setBrightImage(null);
                setMultiImages([]);
                setAadharImageTop(null);
                setAadharImageBottom(null);
              }}
            >
              <Text style={styles.optionText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {layout === 'multi_a4' && (
          <View style={styles.multiSelector}>
            <Text style={{ fontSize: 16, marginBottom: 6 }}>Select number of photos:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {photoCounts.map((count) => (
                <TouchableOpacity
                  key={count}
                  onPress={() => {
                    setMultiCount(count);
                    setMultiImages([]);
                  }}
                  style={[
                    styles.countBtn,
                    multiCount === count && { backgroundColor: '#2196F3' },
                  ]}
                >
                  <Text style={{ color: '#fff' }}>{count}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {layout !== 'multi_a4' && layout !== 'aadhar' && image && (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginBottom: 4 }}>Adjust Brightness:</Text>
            <Slider
              style={{ width: '80%', height: 40 }}
              minimumValue={0.3}
              maximumValue={1.7}
              value={brightness}
              onValueChange={(val) => setBrightness(val)}
              minimumTrackTintColor="#00bcd4"
              maximumTrackTintColor="#000000"
            />
          </View>
        )}

        <Text style={styles.previewLabel}>Preview:</Text>
        {renderLayout()}
      </ScrollView>

      {(image || multiImages.length > 0 || (aadharImageTop && aadharImageBottom)) && (
        <View style={styles.shareBtnWrapper}>
          <Button title="Share / Print (Noko Print)" onPress={shareLayout} color="#2196F3" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  optionsContainer: {
    marginVertical: 15,
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionBtn: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  selectedBtn: { backgroundColor: '#00bcd4' },
  optionText: { color: '#000', fontWeight: '500' },
  previewLabel: { fontSize: 18, marginTop: 10 },
  layoutContainer: {
    width: 358,
    height: 540,
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 20,
  },
  imageWrapper: {
    width: 106,
    height: 130,
    margin: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  passportWrapper: {
    width: 165,
    height: 165,
    margin: 3,
    borderWidth: 1,
    borderColor: '#000',
  },
  photo: { width: '100%', height: '100%', resizeMode: 'cover' },
  passportPhoto: { width: '100%', height: '100%', resizeMode: 'cover' },
  a4Container: {
    width: 595,
    height: 842,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  fullA4Photo: { width: '90%', height: '90%', resizeMode: 'contain' },
  pvcWrapper: {
    width: 260,
    height: 170,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  pvcPhoto: { width: '100%', height: '100%', resizeMode: 'cover' },
  multiPhotoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  multiSelector: { alignItems: 'center', marginVertical: 5 },
  countBtn: {
    padding: 10,
    backgroundColor: '#666',
    borderRadius: 6,
    marginHorizontal: 5,
  },
  shareBtnWrapper: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  
});
