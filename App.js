// import React, { useState, useRef } from 'react';
// import {
//   View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as Sharing from 'expo-sharing';
// import { captureRef } from 'react-native-view-shot';
// import Slider from '@react-native-community/slider';

// const layoutOptions = [
//   { label: '9 Photos (4x6)', value: '4x6_9' },
//   { label: 'Full Image A4', value: 'a4' },
//   { label: 'PVC Card', value: 'pvc' },
//   { label: '6 Passport (2x2)', value: '2x2_6' },
//   { label: 'Multi A4 (2/4/6/9/12)', value: 'multi_a4' },
//   { label: 'Aadhar (Dual)', value: 'aadhar' },
//   { label: 'Custom CM', value: 'custom' },
// ];

// const photoCounts = [2, 4, 6, 9, 12];

// export default function App() {
//   const [image, setImage] = useState(null);
//   const [layout, setLayout] = useState('4x6_9');
//   const [brightness, setBrightness] = useState(1);
//   const [multiCount, setMultiCount] = useState(4);
//   const [multiImages, setMultiImages] = useState([]);
//   const [aadharImageTop, setAadharImageTop] = useState(null);
//   const [aadharImageBottom, setAadharImageBottom] = useState(null);
//   const [customWidth, setCustomWidth] = useState('3.5');
//   const [customHeight, setCustomHeight] = useState('4.5');
  
//   const layoutRef = useRef();

//  const pickImage = async () => {
//     // Logic for Multi A4
//     if (layout === 'multi_a4') {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 1,
//         selectionLimit: multiCount,
        
//       });
//       if (!result.canceled) {
//         setMultiImages(result.assets.map((asset) => asset.uri).slice(0, multiCount));
//       }
//       return;
//     }

//     // NEW LOGIC FOR AADHAR: Two separate crops
//     if (layout === 'aadhar') {
//       Alert.alert("Step 1", "Please select and crop the FRONT side of the Aadhar card.");
//       const front = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true, // Enables cropping
//         quality: 1,
//       });

//       if (!front.canceled) {
//         setAadharImageTop(front.assets[0].uri);

//         // Immediately ask for the Back side
//         Alert.alert("Step 2", "Now select and crop the BACK side of the Aadhar card.");
//         const back = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Images,
//           allowsEditing: true, // Enables cropping
//           quality: 1,
//         });

//         if (!back.canceled) {
//           setAadharImageBottom(back.assets[0].uri);
//         }
//       }
//       return;
//     }

//     // Standard Logic for Single Photos
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true, 
//       quality: 1,
//               // aspect: [1, 1],

//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//       setBrightness(1);
//     }
//   };

//   const shareLayout = async () => {
//     try {
//       const uri = await captureRef(layoutRef, { format: 'png', quality: 1 });
//       await Sharing.shareAsync(uri);
//     } catch (e) { console.error(e); }
//   };

//   const renderLayout = () => {
//     if ((layout === 'multi_a4' && multiImages.length === 0) || 
//         (layout === 'aadhar' && (!aadharImageTop || !aadharImageBottom))) return null;
//     if (layout !== 'multi_a4' && layout !== 'aadhar' && !image) return null;

//     const imgStyle = { width: '100%', height: '100%', resizeMode: 'contain', opacity: brightness };

//     switch (layout) {
//      case '4x6_9':
//         return (
//           <View style={styles.layout4x6} ref={layoutRef} collapsable={false}>
//             {[...Array(9)].map((_, i) => (
//               <View key={i} style={styles.gridItem}>
//                 <Image 
//                   source={{ uri: image }} 
//                   style={{ 
//                     width: '100%', 
//                     height: '100%', 
//                     resizeMode: 'stretch', // Forces the snip to fill the width/height perfectly
//                     opacity: brightness 
//                   }} 
//                 />
//               </View>
//             ))}
//           </View>
//         );
//      case 'pvc':
//         return (
//           <View style={styles.layout4x6} ref={layoutRef} collapsable={false}>
//             <View style={styles.pvcCard}>
//               <Image 
//                 source={{ uri: image }} 
//                 style={{ 
//                   width: '100%', 
//                   height: '100%', 
//                   resizeMode: 'stretch', // Forces the snip to fill the wide PVC shape
//                   opacity: brightness 
//                 }} 
//               />
//             </View>
//           </View>
//         );
//       case '2x2_6':
//         return (
//           <View style={styles.layout4x6} ref={layoutRef} collapsable={false}>
//             {[...Array(6)].map((_, i) => (
//               <View key={i} style={styles.passportBox}>
//                 <Image 
//                   source={{ uri: image }} 
//                   style={{ 
//                     width: '100%', 
//                     height: '100%', 
//                     resizeMode: 'stretch', // Forces image to fill the 2x2 width and height
//                     opacity: brightness 
//                   }} 
//                 />
//               </View>
//             ))}
//           </View>
//         );
//      case 'aadhar':
//         return (
//           <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
//             <View style={styles.aadharImgBox}>
//               <Image source={{ uri: aadharImageTop }} style={styles.aadharImg} />
//             </View>
//             <View style={{ height: 20 }} />
//             <View style={styles.aadharImgBox}>
//               <Image source={{ uri: aadharImageBottom }} style={styles.aadharImg} />
//             </View>
//           </View>
//         );
//       case 'multi_a4':
//         // Dynamic sizing logic to fit 2, 4, 6, 9, or 12 photos on one A4
//         const getStyles = () => {
//           if (multiCount <= 2) return { width: 500, height: 350 }; // 1 column
//           if (multiCount <= 6) return { width: 260, height: 240 }; // 2 columns
//           return { width: 170, height: 180 }; // 3 columns (for 9 and 12)
//         };
//         const itemSize = getStyles();

//         return (
//           <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
//             <View style={styles.multiGrid}>
//               {multiImages.map((uri, i) => (
//                 <View key={i} style={{ 
//                   width: itemSize.width, 
//                   height: itemSize.height, 
//                   margin: 5, 
//                   borderWidth: 1, 
//                   borderColor: '#000',
//                   overflow: 'hidden' 
//                 }}>
//                   <Image 
//                     source={{ uri }} 
//                     style={{ 
//                       width: '100%', 
//                       height: '100%', 
//                       resizeMode: 'stretch' // Fills the box exactly
//                     }} 
//                   />
//                 </View>
//               ))}
//             </View>
//           </View>
//         )
//         // Calculate dynamic width based on count so they fit the 595px A4 width
//         const getImgWidth = () => {
//           if (multiCount <= 2) return 500; // Large 
//           if (multiCount <= 6) return 260; // 2 per row
//           return 170; // 3 per row (for 9 and 12)
//         };
//         const getImgHeight = () => {
//           if (multiCount <= 2) return 350;
//           if (multiCount <= 6) return 240;
//           return 180;
//         };

//         return (
//           <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
//             <View style={styles.multiGrid}>
//               {multiImages.map((uri, i) => (
//                 <Image 
//                   key={i} 
//                   source={{ uri }} 
//                   style={{ 
//                     width: getImgWidth(), 
//                     height: getImgHeight(), 
//                     margin: 5, 
//                     borderWidth: 1,
//                     resizeMode: 'stretch' // Fills the grid box
//                   }} 
//                 />
//               ))}
//             </View>
//           </View>
//         );
//       case 'a4':
//         return (
//           <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
//             <Image source={{ uri: image }} style={[imgStyle, {resizeMode: 'contain'}]} />
//           </View>
//         );
//       case 'custom':
//         const pxWidth = parseFloat(customWidth || 0) * 118;
//         const pxHeight = parseFloat(customHeight || 0) * 118;
//         return (
//           <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
//             <View style={{ width: pxWidth, height: pxHeight, borderWidth: 1, overflow: 'hidden' }}>
//               <Image source={{ uri: image }} style={imgStyle} />
//             </View>
//           </View>
//         );
//       default: return null;
//     }
//   };

//   return (
//     <View style={styles.screen}>
//       <ScrollView contentContainerStyle={styles.scroll}>
//         <Text style={styles.title}>📸 Photo Print Pro</Text>
//         <Button title="Select & Snip Photo" onPress={pickImage} color="#00bcd4" />

//         <View style={styles.tabs}>
//           {layoutOptions.map((opt) => (
//             <TouchableOpacity key={opt.value} 
//               style={[styles.tab, layout === opt.value && styles.activeTab]}
//               onPress={() => { setLayout(opt.value); setImage(null); setMultiImages([]); }}>
//               <Text style={[styles.tabText, layout === opt.value && {color: '#fff'}]}>{opt.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {image && (
//           <View style={styles.sliderBox}>
//             <Text>Brightness</Text>
//             <Slider style={{width: 250, height: 40}} minimumValue={0.5} maximumValue={1.5} value={brightness} onValueChange={setBrightness} />
//           </View>
//         )}

//         <Text style={styles.previewLabel}>Preview:</Text>
//         <View style={styles.previewContainer}>
//           <View style={{ transform: [{ scale: Platform.OS === 'web' ? 1 : 0.45 }] }}>
//             {renderLayout()}
//           </View>
//         </View>
//         {layout === 'multi_a4' && (
//           <View style={{ alignItems: 'center', marginVertical: 10 }}>
//             <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Set Layout Count:</Text>
//             <View style={{ flexDirection: 'row' }}>
//               {photoCounts.map((count) => (
//                 <TouchableOpacity 
//                   key={count} 
//                   onPress={() => {
//                     setMultiCount(count);
//                     setMultiImages([]); // Clear old images when layout changes
//                   }} 
//                   style={[
//                     { padding: 10, backgroundColor: '#666', borderRadius: 5, marginHorizontal: 4 },
//                     multiCount === count && { backgroundColor: '#00bcd4' }
//                   ]}>
//                   <Text style={{ color: '#fff', fontWeight: 'bold' }}>{count}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         )}
//       </ScrollView>

//       {(image || multiImages.length > 0 || aadharImageTop) && (
//         <View style={styles.footer}>
//           <Button title="Print / Share" onPress={shareLayout} color="#2196F3" />
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1, backgroundColor: '#f0f4f7',marginTop:50 },
//   scroll: { padding: 20, alignItems: 'center', paddingBottom: 120 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
//   tabs: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
//   tab: { backgroundColor: '#ddd', padding: 8, borderRadius: 8, margin: 4 },
//   activeTab: { backgroundColor: '#00bcd4' },
//   tabText: { fontSize: 11, fontWeight: 'bold' },
//   sliderBox: { width: '100%', alignItems: 'center', marginVertical: 10 },
//   previewLabel: { fontWeight: 'bold', marginTop: 20 },
//   previewContainer: { height: 400, justifyContent: 'center', alignItems: 'center' },
  
//   // FIXED 4x6 Canvas (400px x 600px)
//   layout4x6: { 
//     width: 400, 
//     height: 600, 
//     backgroundColor: '#fff', 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     padding: 10,
//     justifyContent: 'flex-start', // Starts items from top-left
//     alignContent: 'flex-start' 
//   },
  
//   // FIXED Grid Item for 9 Photos (Exactly 3 per row)
//   gridItem: { 
//     width: 115,    // (400 - 20 padding) / 3 = ~126. Reduced to 120 for spacing.
//     height: 140, 
//     margin: 5, 
//     borderWidth: 0.5, 
//     borderColor: '#000', 
//     overflow: 'hidden' 
//   },

//   pvcCard: { width: 350, height: 218, marginTop: 20, marginLeft: 15, borderWidth: 1, borderColor: '#000', overflow: 'hidden' },
// passportBox: { 
//   width: 180,    // Fits 2 photos perfectly (180 + 180 = 360, plus margins = 400)
//   height: 170,   // Fits 3 rows perfectly (180 * 3 = 540, fits inside 600 height)
//   margin: 5,     // Small margin to prevent pushing photos off-page
//   borderWidth: 0.5, 
//   borderColor: '#000', 
//   overflow: 'hidden' 
// },  
//   a4Container: { width: 595,  padding: 15,height: 842, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', elevation: 5 },
// multiGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     justifyContent: 'center', 
//     alignContent: 'center',
//     width: '100%',
//     padding: 10 
//   },  multiGridImg: { width: 170, height: 180, margin: 5, borderWidth: 1 },
//   aadharImg: { width: 480, height: 300, borderWidth: 1, borderColor: '#000' },
  
//   footer: { position: 'absolute', bottom: 50, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },

// aadharImgBox: {
//     width: 480, 
//     height: 300, 
//     borderWidth: 1, 
//     borderColor: '#000', 
//     overflow: 'hidden',
//     backgroundColor: '#fff'
//   },
//   aadharImg: { 
//     width: '100%', 
//     height: '100%', 
//     resizeMode: 'stretch' // Ensures your snip fills the ID card shape
//   },
// });

import React, { useState, useRef } from 'react';
import {
  View, Text, Button, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, StatusBar
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import Slider from '@react-native-community/slider';

const layoutOptions = [
  { label: '9 Photos (4x6)', value: '4x6_9', icon: '📱' },
  { label: 'A4 Full', value: 'a4', icon: '📄' },
  { label: 'PVC Card', value: 'pvc', icon: '💳' },
  { label: 'Passport', value: '2x2_6', icon: '👤' },
  { label: 'Multi A4', value: 'multi_a4', icon: '📑' },
  { label: 'Aadhar', value: 'aadhar', icon: '🆔' },
  { label: 'Custom', value: 'custom', icon: '⚙️' },
];

const photoCounts = [2, 4, 6, 9, 12];

export default function App() {
  const [image, setImage] = useState(null);
  const [layout, setLayout] = useState('4x6_9');
  const [brightness, setBrightness] = useState(1);
  const [multiCount, setMultiCount] = useState(4);
  const [multiImages, setMultiImages] = useState([]);
  const [aadharImageTop, setAadharImageTop] = useState(null);
  const [aadharImageBottom, setAadharImageBottom] = useState(null);
  const [customWidth, setCustomWidth] = useState('3.5');
  const [customHeight, setCustomHeight] = useState('4.5');
  
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
        setMultiImages(result.assets.map((asset) => asset.uri).slice(0, multiCount));
      }
      return;
    }

    if (layout === 'aadhar') {
      Alert.alert("Step 1", "Crop FRONT side (3:2 ratio suggested)");
      const front = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [3, 2],
        quality: 1,
      });

      if (!front.canceled) {
        setAadharImageTop(front.assets[0].uri);
        Alert.alert("Step 2", "Crop BACK side (3:2 ratio suggested)");
        const back = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          // aspect: [3, 2],
          quality: 1,
        });
        if (!back.canceled) setAadharImageBottom(back.assets[0].uri);
      }
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      // aspect: layout === '2x2_6' ? [1, 1] : undefined,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setBrightness(1);
    }
  };

  const shareLayout = async () => {
    try {
      const uri = await captureRef(layoutRef, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri);
    } catch (e) { console.error(e); }
  };

  const renderLayout = () => {
    if ((layout === 'multi_a4' && multiImages.length === 0) || 
        (layout === 'aadhar' && (!aadharImageTop || !aadharImageBottom))) return null;
    if (layout !== 'multi_a4' && layout !== 'aadhar' && !image) return null;

    const imgStyle = { width: '100%', height: '100%', opacity: brightness };

    switch (layout) {
      case '4x6_9':
        return (
          <View style={styles.layout4x6} ref={layoutRef} collapsable={false}>
            {[...Array(9)].map((_, i) => (
              <View key={i} style={styles.gridItem}>
                <Image source={{ uri: image }} style={[imgStyle, {resizeMode: 'stretch'}]} />
              </View>
            ))}
          </View>
        );
      case 'pvc':
        return (
          <View style={styles.layout4x6} ref={layoutRef} collapsable={false}>
            <View style={styles.pvcCard}>
              <Image source={{ uri: image }} style={[imgStyle, {resizeMode: 'stretch'}]} />
            </View>
          </View>
        );
      case '2x2_6':
        return (
          <View style={styles.layout4x6} ref={layoutRef} collapsable={false}>
            {[...Array(6)].map((_, i) => (
              <View key={i} style={styles.passportBox}>
                <Image source={{ uri: image }} style={[imgStyle, {resizeMode: 'stretch'}]} />
              </View>
            ))}
          </View>
        );
      case 'aadhar':
        return (
          <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
            <View style={styles.aadharImgBox}><Image source={{ uri: aadharImageTop }} style={styles.aadharImg} /></View>
            <View style={{ height: 20 }} />
            <View style={styles.aadharImgBox}><Image source={{ uri: aadharImageBottom }} style={styles.aadharImg} /></View>
          </View>
        );
      case 'multi_a4':
        const getStyles = () => {
          if (multiCount <= 2) return { width: 500, height: 350 };
          if (multiCount <= 6) return { width: 260, height: 240 };
          return { width: 170, height: 180 };
        };
        const itemSize = getStyles();
        return (
          <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
            <View style={styles.multiGrid}>
              {multiImages.map((uri, i) => (
                <View key={i} style={{ width: itemSize.width, height: itemSize.height, margin: 5, borderWidth: 1, overflow: 'hidden' }}>
                  <Image source={{ uri }} style={{ width: '100%', height: '100%', resizeMode: 'stretch' }} />
                </View>
              ))}
            </View>
          </View>
        );
      case 'a4':
        return (
          <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
            <Image source={{ uri: image }} style={[imgStyle, {resizeMode: 'contain'}]} />
          </View>
        );
      case 'custom':
        const pxWidth = parseFloat(customWidth || 0) * 118;
        const pxHeight = parseFloat(customHeight || 0) * 118;
        return (
          <View style={styles.a4Container} ref={layoutRef} collapsable={false}>
            <View style={{ width: pxWidth, height: pxHeight, borderWidth: 1, overflow: 'hidden' }}>
              <Image source={{ uri: image }} style={[imgStyle, {resizeMode: 'stretch'}]} />
            </View>
          </View>
        );
      default: return null;
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2a6c" />
      
      {/* Dynamic Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Photo Print Pro</Text>
        <Text style={styles.headerSubtitle}>Developed by Sammek Sovitkar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Layout Selection Chips */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Select Layout</Text>
          <View style={styles.tabs}>
            {layoutOptions.map((opt) => (
              <TouchableOpacity key={opt.value} 
                style={[styles.tab, layout === opt.value && styles.activeTab]}
                onPress={() => { setLayout(opt.value); setImage(null); setMultiImages([]); setAadharImageTop(null); }}>
                <Text style={styles.tabIcon}>{opt.icon}</Text>
                <Text style={[styles.tabText, layout === opt.value && styles.activeTabText]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.mainPickBtn} onPress={pickImage}>
          <Text style={styles.mainPickBtnText}>📸 Select & Snip Photo</Text>
        </TouchableOpacity>

        {/* Multi-A4 Options */}
        {layout === 'multi_a4' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Set Photo Count</Text>
            <View style={styles.photoCountRow}>
              {photoCounts.map((count) => (
                <TouchableOpacity key={count} onPress={() => { setMultiCount(count); setMultiImages([]); }} 
                  style={[styles.countBtn, multiCount === count && styles.activeCountBtn]}>
                  <Text style={[styles.countBtnText, multiCount === count && styles.activeCountBtnText]}>{count}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Brightness Controls */}
        {image && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Adjust Brightness</Text>
            <Slider style={styles.slider} minimumValue={0.5} maximumValue={1.5} value={brightness} onValueChange={setBrightness} minimumTrackTintColor="#00bcd4" thumbTintColor="#00bcd4" />
          </View>
        )}

        {/* Preview Area */}
        <Text style={styles.previewLabel}>Visual Preview</Text>
        <View style={styles.previewContainer}>
          <View style={{ transform: [{ scale: Platform.OS === 'web' ? 0.8 : 0.45 }] }}>
            {renderLayout()}
          </View>
        </View>
      </ScrollView>

      {/* Floating Footer Button */}
      {(image || multiImages.length > 0 || aadharImageTop) && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.shareBtn} onPress={shareLayout}>
            <Text style={styles.shareBtnText}>📤 Print / Share Layout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#1a2a6c', padding: 25, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 10 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  headerSubtitle: { color: '#00bcd4', fontSize: 14, textAlign: 'center', marginTop: 5, fontWeight: '600', letterSpacing: 1 },
  scroll: { padding: 15, paddingBottom: 120 },
  
  sectionCard: { backgroundColor: '#fff', padding: 15, borderRadius: 20, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  
  tabs: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tab: { backgroundColor: '#f0f0f0', width: '30%', paddingVertical: 12, borderRadius: 15, alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  activeTab: { backgroundColor: '#1a2a6c', borderColor: '#1a2a6c' },
  tabIcon: { fontSize: 20, marginBottom: 5 },
  tabText: { fontSize: 10, fontWeight: 'bold', color: '#666' },
  activeTabText: { color: '#fff' },

  mainPickBtn: { backgroundColor: '#00bcd4', padding: 18, borderRadius: 20, alignItems: 'center', marginVertical: 10, elevation: 5 },
  mainPickBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  photoCountRow: { flexDirection: 'row', justifyContent: 'space-around' },
  countBtn: { padding: 12, width: 50, alignItems: 'center', backgroundColor: '#eee', borderRadius: 12 },
  activeCountBtn: { backgroundColor: '#00bcd4' },
  countBtnText: { fontWeight: 'bold', color: '#333' },
  activeCountBtnText: { color: '#fff' },

  slider: { width: '100%', height: 40 },
  previewLabel: { textAlign: 'center', fontWeight: 'bold', color: '#999', marginVertical: 10, textTransform: 'uppercase', letterSpacing: 2 },
  previewContainer: { height: 420, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9ecef', borderRadius: 25, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd' },
  
  // Layout Rendering Styles
  layout4x6: { width: 400, height: 600, backgroundColor: '#fff', flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'center' },
  gridItem: { width: 115, height: 140, margin: 5, borderWidth: 0.5, borderColor: '#000', overflow: 'hidden' },
  pvcCard: { width: 350, height: 218, marginTop: 180, borderWidth: 1, borderColor: '#000', overflow: 'hidden' },
  passportBox: { width: 180, height: 170, margin: 5, borderWidth: 0.5, borderColor: '#000', overflow: 'hidden' },  
  a4Container: { width: 595, height: 842, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
  multiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%' },
  aadharImgBox: { width: 480, height: 300, borderWidth: 1, borderColor: '#000', overflow: 'hidden' },
  aadharImg: { width: '100%', height: '100%', resizeMode: 'stretch' },
  
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20 },
  shareBtn: { backgroundColor: '#1a2a6c', padding: 18, borderRadius: 20, alignItems: 'center' },
  shareBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
