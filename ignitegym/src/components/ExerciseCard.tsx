import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Heading, HStack, Image, Text, VStack, Icon } from '@gluestack-ui/themed';
import { ChevronRight } from 'lucide-react-native'

type Props = TouchableOpacityProps & {
  title: string
};

export function ExerciseCard({ title, ...rest }: Props) {
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
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhi9MQlfugzAbRm9UKRGYZ4laohwQO30DTrg&s',
          }} 
          alt='Imagem do exercício'
          w='$16'
          h='$16'
          rounded='$md'
          mr='$4'
          resizeMode='cover'
        />

        <VStack flex={1}>
          <Heading color='white' fontSize='$lg' fontFamily='$heading'>
            {title}
          </Heading>

          <Text 
            fontSize='$sm' 
            color='$gray200' 
            mt='$1' 
            numberOfLines={2}
          >
            3 séries x 12 repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color='white' />
      </HStack>
    </TouchableOpacity>
  );
}