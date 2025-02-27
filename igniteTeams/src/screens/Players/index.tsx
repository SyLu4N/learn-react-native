import React, { useEffect, useState, useRef, Fragment } from 'react';
import { Alert, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { Header } from '@content/Header';

import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { ListEmpty } from '@components/ListEmpty';
import { Highlight } from '@components/Highlight';
import { ButtonIcon } from '@components/ButtonIcon';
import { PlayerCard } from '@components/PlayerCard';
import { Loading } from '@components/Loading';
import { Button } from '@components/Button';

import { AppError } from '@utils/AppError';

import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';

import { Container, Form, HeaderList, NumbersOfPlayers } from './styles';
import { TextInput } from 'react-native';

type RouterParams = {
  group: string
}

export function Players() {
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [team, setTeam] = useState('Time A');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { group } = route.params as RouterParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer(name: string) {
    if(name.trim().length <= 2) {
      return Alert.alert(
        'Nova pessoa', 'Nome da pessoa deve ter no mínimo 3 caracteres'
      );
    }

    const player = { name, team };

    try {
      await playerAddByGroup(player, group);
      setPlayers(prevState => [...prevState, player]);
    } catch (error) {
      if (error instanceof AppError) {
        return Alert.alert('Nova pessoa', error.message);
      }

      console.log(error);
      Alert.alert('Nova pessoa', 'Não foi possível adicionar nova pessoa.');
    } finally {
      newPlayerNameInputRef.current?.blur();
      setName('');
    }
  }

  async function fetchPlayersByTeam() {
    setIsLoading(true);

    try {
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas desse time.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError) {
        return Alert.alert('Remover pessoa', error.message);
      }

      console.log(error);
      Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.');
    }
  }

  async function groupRemove() {	
    try {
      await groupRemoveByName(group);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Remover turma', 'Não foi possível remover essa turma.');
    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      'Remover turma', 
      'Deseja remover a turma?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove() }
      ]
    );
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team])

  return (
    <Container>
      <Header showBackButton /> 

      <Highlight 
        title={group}
        subtitle='Adicione a galera e separe os times' 
      /> 

      <Form>
        <Input 
          placeholder='Nome da pessoa' 
          autoCorrect={false} 
          value={name} 
          onChangeText={setName}
          inputRef={newPlayerNameInputRef}
          onSubmitEditing={() => handleAddPlayer(name)}
          returnKeyType='done'
        />
        
        <ButtonIcon icon='add' onPress={() => handleAddPlayer(name)} />
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          horizontal
          renderItem={({ item }) => (
            <Filter 
              title={item} 
              isActive={item === team} 
              onPress={() => setTeam(item)}
            />
          )}
        />

        <NumbersOfPlayers>
          {players.length}
        </NumbersOfPlayers>
      </HeaderList>


      {isLoading ? 
        <Loading /> : (
        <Fragment>
          <FlatList 
            data={players}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              { paddingBottom: 100 },
              players.length === 0 && { flex: 1 }
            ]}
            renderItem={({ item }) => (
              <PlayerCard 
                name={item.name} 
                onRemove={() => handleRemovePlayer(item.name)} 
              />
            )}
            ListEmptyComponent={() => (
              <ListEmpty message='Não há pessoas nesse time' />
            )}
          />

          <Button 
            type='SECONDARY'
            title='Remover turma'
            onPress={handleGroupRemove}
          />
       </Fragment>
      )}
    </Container>
  );
}