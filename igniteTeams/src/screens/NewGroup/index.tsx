import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import { Header } from '@content/Header';
import { Highlight } from '@components/Highlight';
import { Button } from '@components/Button';

import {Container, Content, Icon} from './styles';
import { Input } from '@components/Input';

export function NewGroup() {
  const navigation = useNavigation();

  const [group, setGroup] = useState('');

  function handleNewGroup() {
    navigation.navigate('players', { group });
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