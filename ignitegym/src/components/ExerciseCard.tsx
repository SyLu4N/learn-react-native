import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Image, Text, VStack, Icon } from '@gluestack-ui/themed';
import { ChevronRight } from 'lucide-react-native';

import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { api } from '@services/api';

type Props = TouchableOpacityProps & {
  data: ExerciseDTO;
};

export function ExerciseCard({ data, ...rest }: Props) {
  const exerciceThumb = `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`;

  return(
    <TouchableOpacity {...rest}>
      <HStack 
        bg='$gray500' 
        alignItems='center' 
        p='$2' 
        pr='$4' 
        rounded='$md' 
        mb='$3'
      >
        <Image 
          source={{ uri: exerciceThumb }} 
          alt='Imagem do exercício'
          w='$16'
          h='$16'
          rounded='$md'
          backgroundColor='$gray700'
          mr='$4'
          resizeMode='cover'
        />

        <VStack flex={1}>
          <Heading color='white' fontSize='$lg' fontFamily='$heading'>
            {data.name}
          </Heading>

          <Text 
            fontSize='$sm' 
            color='$gray200' 
            mt='$1' 
            numberOfLines={2}
          >
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color='white' />
      </HStack>
    </TouchableOpacity>
  );
}