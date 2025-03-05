import { useState } from 'react';
import { FlatList } from 'react-native';
import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed';

import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';
import { ExerciseCard } from '@components/ExerciseCard';

export function Home() {
  const [exercises, setExercices] = useState([
    'Puxada frontal', 
    'Remada Lateral', 
    'Remada Curvada', 
    'Remada unilateral',
  ]);
  
  const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'Ombro']);
  const [groupSelected, setGGroupSelected] = useState('Costas');

  return(
    <VStack flex={1}>
      <HomeHeader />

      <FlatList 
        data={groups}
        keyExtractor={item => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Group 
            name={item} 
            isActive={groupSelected === item} 
            onPress={() => setGGroupSelected(item)} 
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      <VStack px='$8' flex={1}>
        <HStack justifyContent='space-between' alignItems='center' mb='$5'>
          <Heading color='$gray200' fontSize='$md' fontFamily='$heading'>Exercícios</Heading>

          <Text color='$gray200' fontSize='$sm' fontFamily='$body'>
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={ item => item }
          renderItem={({ item }) => <ExerciseCard title={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  );
}