import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import { Header } from '@content/Header';
import { Highlight } from '@components/Highlight';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { groupCreate } from '@storage/group/groupCreate';

import {Container, Content, Icon} from './styles';
import { AppError } from '@utils/AppError';
import { Alert } from 'react-native';

export function NewGroup() {
  const navigation = useNavigation();

  const [group, setGroup] = useState('');

  async function handleNewGroup() {
    try {
      if (group.trim().length <= 2) {
        return Alert.alert(
          'Nova turma', 'O nome da turma precisa ter pelo menos 3 letras'
        );
      }

      await groupCreate(group);

      navigation.navigate('players', { group });
    } catch (error) {
      if (error instanceof AppError) {
        return Alert.alert('Nova turma', error.message);
      }
      
      Alert.alert('Nova turma', 'Não foi possível criar uma nova turma');
      console.log(error);
    }
  }

  return (
    <Container>
      <Header showBackButton />

      <Content>
        <Icon />

        <Highlight
          title='Nova turma'
          subtitle='crie a turma para adicionar as pessoas'
        />

        <Input 
          placeholder='Nome da turma'
          onChangeText={e => setGroup(e)}
          value={group}
        />

        <Button title='Criar' style={{ marginTop: 20 }} onPress={handleNewGroup} />
      </Content>
      
    </Container>
  );
}