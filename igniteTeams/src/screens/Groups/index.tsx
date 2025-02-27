import React, { useState, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Alert, FlatList } from 'react-native';

import { Header } from '@content/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';

import { Container } from './styles';
import { Button } from '@components/Button';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/Loading';

export function Groups() {
  const navigation = useNavigation();

  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function handleNewGroup() {
    navigation.navigate('new');
  }

  async function fetchGroups() {
    setIsLoading(true);

    try {
      const data = await groupsGetAll();
      setGroups(data);
    } catch (error) {
      Alert.alert('Turmas', 'Não foi possível carregar as turmas.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group });
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []))

  return (
    <Container>
      <Header />

      <Highlight
        title='Turmas'
        subtitle='jogue com a sua turma'
      />

      {isLoading ? <Loading /> : (
        <>
          <FlatList 
            data={groups}
            keyExtractor={item => item}
            contentContainerStyle={!groups.length && { flex: 1 }}
            renderItem={({ item }) => (
              <GroupCard title={item} onPress={() => handleOpenGroup(item)} />
            )}
            ListEmptyComponent={() => (
              <ListEmpty message='Que tal cadastrar a primeira turma?' />
            )}
          />

          <Button  
            title="Criar nova turma"
            onPress={handleNewGroup}
          />
        </>
      )}
    </Container>
  );
}
