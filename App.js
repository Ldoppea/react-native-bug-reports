import React, {useState} from 'react';
import {View, Button, StyleSheet, Text, TextInput} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import {FullWindowOverlay} from 'react-native-screens';
import RNFS from 'react-native-fs';

export const App = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const downloadFile = async () => {
    const downloadUrl =
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1920px-Image_created_with_a_mobile_phone.png';

    const destinationPath = `${RNFS.DocumentDirectoryPath}/SampleImage.png`;
    const result = await RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: destinationPath,
      begin: () => undefined,
      progress: res => {
        const progressPercent = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Download progress is ${progressPercent}%`);
      },
      progressInterval: 100,
    }).promise;

    console.log(`Donload result is ${JSON.stringify(result)}`);

    const {statusCode} = result;

    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(`Status code: ${statusCode}`);
    }

    return destinationPath;
  };

  const openFile = () => {
    const path = `${RNFS.DocumentDirectoryPath}/SampleImage.png`;
    FileViewer.open(path);

    setTimeout(() => {
      setIsOverlayVisible(true);
    }, 2000);
  };

  const closeHover = () => {
    setIsOverlayVisible(false);
  };

  const handleKeyDown = e => {
    if (e.nativeEvent.key?.toLowerCase() == 'a') {
      setIsOverlayVisible(false);
    }
  };

  return isOverlayVisible ? (
    <>
      <FullWindowOverlay>
        <View style={styles.view2}>
          <Text>
            This text input is interactable (press &#39;a&#39; to close the Overlay)
          </Text>
          <TextInput style={styles.input} onKeyPress={handleKeyDown} />
          <Button
            onPress={closeHover}
            title="Click to close the Overlay (but this won't work)"
          />
        </View>
      </FullWindowOverlay>
    </>
  ) : (
    <View style={styles.view1}>
      <Button onPress={downloadFile} title="1. Click to download file" />
      <Button onPress={openFile} title="2. Click to open file viewer" />
    </View>
  );
};

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    backgroundColor: '#99FF99',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view2: {
    backgroundColor: '#FF9999',
    marginVertical: 250,
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default App;
