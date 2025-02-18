import { Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { styles } from './styles';
import { Participant } from '../../components/Participant';
import React, { useState } from 'react';

export function Home() {
  const [ participantes, setParticipantes ] = useState<string[]>([]);
  const [ participanteName, setParticipanteName ] = useState('');

  function handleParticipantAdd(name: string) {
    if (participantes.includes(name)) {
      return Alert.alert(
        'Participante já adicionado', 
        'Esse participante já foi adicionado ao evento'
      );
    }

    setParticipantes((prevState) => [...prevState, name]);
    setParticipanteName('');
  }

  function handleParticipantRemove(index: number) {
    return Alert.alert(
      "Remover participante", 
      `Deseja realmente remover ${participantes[index]}?`,
      [{
        text: 'Cancelar',
        style: 'cancel'
      }, {
        text: 'Remover',
        onPress: () => { 
          setParticipantes(
            (prevState) => prevState.filter((_, i) => i !== index)
          );
        }
      }]
    );
  }
  
  return(
    <View style={styles.container}>
      <Text style={styles.eventName}>Nome do evento </Text>

      <Text style={styles.eventDate}>Sexta, 4 de Novembro de 2022</Text>

      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder='Nome do participante'
          placeholderTextColor='#6b6b6b'
          value={participanteName}
          onChangeText={setParticipanteName}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleParticipantAdd(participanteName)}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={participantes} 
        keyExtractor={item => item} 
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          () => <Text style={styles.empty}>Nenhum participante chegou ao evento</Text>
        }
        renderItem={({ item, index }) => (
          <Participant 
            key={index} 
            name={item} 
            onRemove={() => handleParticipantRemove(index)}
          />
        )} 
      />
    </View>
  );
}