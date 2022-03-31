import React, {useEffect, useRef, useState} from 'react';
import {AppState, Button, StyleSheet, Text, View} from 'react-native';
import {EventRegister} from 'react-native-event-listeners';

const App = () => {
  let buttonClickEventListener = useRef<any>({});
  const [eventRegisterText, setEventRegisterText] = useState('');
  const [appState] = useState(AppState.currentState);
  const [counter, setCounter] = useState(0);

  // Event Register Example useEffect
  useEffect(() => {
    setEventRegisterText('Created onButtonClick event listener');
    buttonClickEventListener.current = EventRegister.addEventListener(
      'onButtonClick',
      listenerData => {
        setEventRegisterText(
          'onButtonClick event listener payload: ' + listenerData,
        );
        console.log('onButtonClick event payload: ', listenerData);
      },
    );

    return () => {
      // Destroys the event listener when the component unmounts
      setEventRegisterText('onButtonClick event listener destroyed');
      EventRegister.removeEventListener(buttonClickEventListener.current);
      console.log('onButtonClick event listener destroyed');
    };
  }, []);

  // App State Example useEffect
  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', state => {
      console.log('App State changed to: ', state);
      if (state !== 'active') {
        setCounter(prevState => prevState + 1);
      }
    });

    return () => {
      appStateListener.remove();
    };
  }, []);

  useEffect(() => {
    console.log(appState);
  });

  const handleEmitEvent = () => {
    console.log('trying to emmit onButtonClick event');
    EventRegister.emit('onButtonClick', 'WORKS!');
  };

  const destroyEventListener = () => {
    EventRegister.removeEventListener(buttonClickEventListener.current);
    setEventRegisterText('onButtonClick event listener destroyed');
    console.log('onButtonClick event listener destroyed');
  };

  const createEventListener = () => {
    EventRegister.addEventListener('onButtonClick', listenerData => {
      console.log('onButtonClick event payload: ', listenerData);
    });
    console.log('onButtonClick event listener re-created');
    setEventRegisterText('onButtonClick event listener re-created');
  };

  return (
    <View style={styles.container}>
      <View style={styles.exampleContainer}>
        <View style={styles.spacing} />
        <Text style={styles.exampleTitle}>EventRegister Example</Text>
        <View style={styles.spacing} />
        <Button title="Emit Event" onPress={handleEmitEvent} />
        <View style={styles.spacing} />
        <Button title="Destroy Event Listener" onPress={destroyEventListener} />
        <View style={styles.spacing} />
        <Button title="Recreate Event" onPress={createEventListener} />
        <View style={styles.spacing} />
        <Text style={styles.exampleTitle}>{eventRegisterText}</Text>
      </View>
      <View style={styles.exampleContainer}>
        <View style={styles.spacing} />
        <Text style={styles.exampleTitle}>App State Example</Text>
        <View style={styles.spacing} />
        <Text style={styles.exampleTitle}>Not active state counter</Text>
        <Text style={styles.exampleTitle}>{counter}</Text>
        <View style={styles.spacing} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacing: {
    marginTop: 16,
  },
  exampleContainer: {
    flex: 1,
    width: '90%',
  },
  exampleTitle: {
    alignSelf: 'center',
    fontSize: 20,
  },
});

export default App;
