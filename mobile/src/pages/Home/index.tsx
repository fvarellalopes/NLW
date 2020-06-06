import React, { useState, useEffect } from 'react';
import { AppLoading } from 'expo';
import { StyleSheet, Text, Image, View, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select';



interface IBGEUFResponse {
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}

const Home = () => {

  const navigation = useNavigation();

  // componentes que carregam dados do IBGE
  const [ufs, setUFS] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUF, setSelectedUF] = useState<String>('0');
  const [selectedCity, setSelectedCity] = useState<String>('0');


  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      setUFS(response.data.map(uf => uf.sigla));
    });
  }, []);

  useEffect(() => {
    if (selectedUF === '0') {
      setCities([]);
      return;
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios?orderBy=nome`).then(response => {
      setCities(response.data.map(city => city.nome));
    });
  }, [selectedUF]);

  function handleSelectUF(uf: String) {

    if (selectedUF !== uf) {
      setSelectedCity('0');
    }
    setSelectedUF(uf);
  }
  function handleSelectCity(city: String) {
    setSelectedCity(city);
  }

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf:selectedUF, city:selectedCity
    })
  }

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{ width: 274, height: 368 }}>
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrare pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <RNPickerSelect
            onValueChange={(uf) => handleSelectUF(uf)}
            placeholder={{ label: 'Selecione uma UF', value: '0' }}
            items={ufs.map(uf => ({ label: uf, value: uf }))}
            style={pickerStyles}
          // useNativeAndroidPickerStyle={false}
          // Icon={() => (
          //   <Icon name="chevron-down" color="#6C6C80" size={24} />
          // )}
          />
          <RNPickerSelect disabled={selectedUF == '0'}
            onValueChange={(city) => handleSelectCity(city)}
            placeholder={{ label: 'Selecione uma Cidade', value: '0' }}
            items={cities.map(city => ({ label: city, value: city }))}
            style={pickerStyles}
          // useNativeAndroidPickerStyle={false}
          // Icon={() => (
          //   <Icon name="chevron-down" color="#6C6C80" size={24} />
          // )}
          />

          <RectButton style={styles.button} onPress={() => { handleNavigateToPoints() }}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 16,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

const pickerStyles = {
  ...StyleSheet.create({
    inputIOS: {
      height: 60,
      backgroundColor: "#fff",
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
    inputAndroid: {
      height: 60,
      backgroundColor: "#fff",
      borderRadius: 10,
      marginBottom: 4,
      paddingHorizontal: 24,
      fontSize: 16,
      borderWidth: 2,
      borderColor: "#34CB79"

    },
    iconContainer: {
      top: 20,
      right: 15,
    },
    placeholder: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
    }
  })
};