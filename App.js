import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import * as Font from 'expo-font'; 

const Stack = createStackNavigator();

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.title}>Mum Baby</Text>
  </View>
);
/////////////////////////////////////////////HOME SCREEN////////////////////////////////////////////
const HomeScreen = ({ navigation }) => {
  const [showAlert, setShowAlert] = useState(true); 

  const handleCloseAlert = () => setShowAlert(false);

  return (
    <View style={styles.container}>
      <Header />
      {showAlert && (
        <View style={styles.alertContainer}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTextTitle}>Bem-vinda ao MumBaby!</Text>
            <Text style={styles.alertText}>
              Estamos aqui para ajudar você a lembrar das tarefas mais importantes.
              Com o MumBaby, você pode viver com mais tranquilidade e se concentrar
              no que realmente importa ♡
            </Text>
            <TouchableOpacity onPress={handleCloseAlert} style={styles.alertButton}>
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!showAlert && ( // Exibe o conteúdo da tela apenas após fechar o alerta
        <View style={styles.content}>
          <Image
            source={require('./src/assets/logo.jpg')}
            style={styles.homeLogo}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={true}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => navigation.navigate('ReminderSettings')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

/////////////////////////////////////REMINDER SETTINGS SCREEN////////////////////////////////////////////
const ReminderSettingsScreen = () => {
  const [reminderName, setReminderName] = useState('');
  const [reminderType, setReminderType] = useState('suplementacao');
  const [reminderFrequency, setReminderFrequency] = useState('diaria');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); 
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'CherryBombOne': require('./assets/fonts/Cherry_Bomb_One.ttf'), 
      });
      setFontLoaded(true); 
    };
    loadFonts();
  }, []); // Esse useEffect é chamado apenas uma vez ao montar o componente

  const handleSaveReminder = () => {
    setModalVisible(true); 
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const showTimePicker = () => {
    setShowPicker(true);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || reminderTime;
    setShowPicker(false);
    setReminderTime(currentTime);
  };

  if (!fontLoaded) {
    return <Text>Loading...</Text>; a
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Image
          source={require('./src/assets/logo.jpg')}
          style={styles.reminderLogo}
        />
        <Text style={styles.label}>O que não posso esquecer...</Text>

        <TextInput
          style={styles.input}
          placeholder=""
          value={reminderName}
          onChangeText={setReminderName}
        />

        <Text style={styles.label}>Tipo de Lembrete:</Text>
        <Picker
          selectedValue={reminderType}
          onValueChange={(itemValue) => setReminderType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Suplementação" value="Suplementação" />
          <Picker.Item label="Consulta" value="Consulta" />
          <Picker.Item label="Vacina" value="Vacina" />
        </Picker>

        <Text style={styles.label}>Horário:</Text>
        <Button title={reminderTime.toLocaleTimeString()} onPress={showTimePicker} />
        {showPicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}

        <Text style={styles.label}>Repetição:</Text>
        <Picker
          selectedValue={reminderFrequency}
          onValueChange={(itemValue) => setReminderFrequency(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Diária" value="Diária" />
          <Picker.Item label="Semanal" value="Semanal" />
          <Picker.Item label="Mensal" value="Mensal" />
          <Picker.Item label="Data a definir" value="Data_a_definir" />
          <Picker.Item label="Não repetir" value="Não_repetir" />
        </Picker>

        <TouchableOpacity
          style={styles.customButton}
          onPress={handleSaveReminder}
        >
          <Text style={styles.buttonText}>Salvar Lembrete</Text>
        </TouchableOpacity>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalOverlay}> {/* Estilo de fundo da modal */}
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Lembrete salvo com sucesso!</Text>
            <Text style={styles.modalText}>{reminderName}</Text>
            <Text style={styles.modalText}>Tipo: {reminderType}</Text>
            <Text style={styles.modalText}>Frequência: {reminderFrequency}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ReminderSettings" component={ReminderSettingsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

////////////////////////////////////////////////STYLES//////////////////////////////////////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 130,
  },
  title: {
    fontSize: 36,
    fontWeight: 'normal',
    color: '#00CED1',
    fontFamily: 'CherryBombOne', 
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  homeLogo: {
    width: 200,
    height: 200,
    marginBottom: 60,
  },
  reminderLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#555',
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  customButton: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semitransparente
  },
  alertBox: {
    width: '80%',
    backgroundColor: '#04B4AE', // Fundo do alerta
    borderRadius: 15, // Bordas arredondadas
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  alertTextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  alertText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  alertButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#04B4AE',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
