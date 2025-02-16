import { Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { styles } from './styles';
import { Participant } from '../../components/Participant';

export function Home() {
  const name = 'Luan Simões';

  const participantes = [
    'Luan Simões', 
    'Nicoli Ramos', 
    'Lucas Simões', 
    'Viviane Simões',
    'Ana Silva', 
    'Carlos Souza', 
    'Fernanda Oliveira', 
    'Marcos Pereira',
    'Aline Ferreira',
  ];

  function handleParticipantAdd(name: string) {
    if (participantes.includes(name)) {
      return Alert.alert(
        'Participante já adicionado', 
        'Esse participante já foi adicionado ao evento'
      );
    }

    console.log('Adicionar participante');
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
        onPress: () => { console.log('Removendo participante') }
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
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleParticipantAdd(name)}
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