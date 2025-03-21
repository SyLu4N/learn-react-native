import { useEffect, useState } from 'react';
import { VStack, Icon, HStack, Heading, Text, Box, useToast } from '@gluestack-ui/themed';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionSvg from '@assets/repetitions.svg'

import { Button } from '@components/Button';
import { Loading } from '@components/Loading';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { useToastError } from '@hooks/useToastError';
import { Image } from 'expo-image';
import { ToastMessage } from '@components/ToastMessage';

type RouteParamsProps = {
  exerciseId: string;
}

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const toast = useToast();
  const toastError = useToastError();
  
  const { exerciseId } = route.params as RouteParamsProps;
  
  const [isLoading, setIsLoading] = useState(true);
  const [sendingRegister, setSedingRegister] = useState(false);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    setIsLoading(true);

    try {
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
      
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = 
        isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício.';
      toastError({ title });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    setSedingRegister(true);

    try {
      await api.post('/history', { exercise_id: exerciseId });

      navigation.navigate('history');

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage 
            id={id} 
            title='Parabéns! Exercício registrado no seu histórico.'
            onClose={() => toast.close(id)}
          />
        )
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = 
        isAppError ? error.message : 'Não foi possível registrar o exercício.';
      toastError({ title });
    } finally {
      setSedingRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  const exerciceDemo = `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`;

  return(
    <VStack flex={1}>
      <VStack px='$8' bg='$gray600' pt='$12'>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color='$green500' size='xl' />
        </TouchableOpacity>

        <HStack 
          justifyContent='space-between' 
          alignItems='center'
          mt='$4'
          mb='$8'
        >
          <Heading 
            color='$gray100' 
            fontFamily='$heading' 
            fontSize='$lg' 
            flexShrink={1}
          >
            {exercise.name}
          </Heading>

          <HStack alignItems='center'>
            <BodySvg />

            <Text ml='$1' color='$gray200' textTransform='capitalize'>
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

     
      {isLoading ? (
        <Loading />
      ) : (
        <VStack p='$8'>
          <Box rounded="$lg" mb="$3" overflow="hidden">
            <Image
              source={{uri: exerciceDemo }}
              alt="Gif do exercício"
              contentFit="cover"
              style={{ width: "100%", height: 320, borderRadius: 8 }}
            />
          </Box>

          <Box bg='$gray600' rounded='$md' pb='$4' px='$4'>
            <HStack 
              alignItems='center' 
              justifyContent='space-around' 
              mb='$6' 
              mt='$5'
            >
              <HStack>
                <SeriesSvg />

                <Text color='$gray200' ml='$2'>
                  {exercise.series} Séries
                </Text>
              </HStack>

              <HStack> 
                <RepetitionSvg /> 

                <Text color='$gray200' ml='$2'>
                  {exercise.repetitions} Repetição
                </Text>
              </HStack>
            </HStack>

            <Button 
              title='Marcar como realizado' 
              onPress={handleExerciseHistoryRegister}
              isLoading={sendingRegister}
            />
          </Box>
        </VStack>
      )}
    </VStack>
  );
}