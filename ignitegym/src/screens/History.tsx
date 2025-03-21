import { SectionList } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Heading, Text, VStack } from '@gluestack-ui/themed';

import { api } from '@services/api';

import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryCard } from '@components/HistoryCard';

import { AppError } from '@utils/AppError';
import { useToastError } from '@hooks/useToastError';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';

export function History() {
  const toastError = useToastError();

  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  async function fetchHistory() {
    setIsLoading(true);

    try {
      const response = await api.get('/history');
      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = 
        isAppError ? error.message : 'Não foi possível carregar o histórico.';
      toastError({ title });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory();
  }, []))

  return(
    <VStack flex={1}>
      <ScreenHeader title='Histórico' />

      <SectionList 
        sections={exercises}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section }) => (
          <Heading 
            fontFamily='$heading'
            color='$gray200' 
            fontSize='$md' 
            mt='$10' 
            mb='$3'
          >
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center'  }
        }
        ListEmptyComponent={() => (
          <Text color='$gray100' textAlign='center'>
            Não há exercícios registrados ainda. {'\n'}
            Vamos fazer exercícios hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}