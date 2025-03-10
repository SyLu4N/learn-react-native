import { VStack, Icon, HStack, Heading, Text, Image, Box, ScrollView } from '@gluestack-ui/themed';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionSvg from '@assets/repetitions.svg'
import { Button } from '@components/Button';

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleGoBack() {
    navigation.goBack();
  }

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
            Puxada frontal
          </Heading>

          <HStack alignItems='center'>
            <BodySvg />

            <Text ml='$1' textTransform='capitalize'>Costas</Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <VStack p='$8'>
          <Image 
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhi9MQlfugzAbRm9UKRGYZ4laohwQO30DTrg&s' }} 
            alt='Puxada frontal' 
            resizeMode='cover'
            rounded='$lg'
            w='$full' 
            h='$80'
            mb='$3'
          />

          <Box bg='$gray600' rounded='$md' pb='$4' px='$4'>
            <HStack 
              alignItems='center' 
              justifyContent='space-around' 
              mb='$6' 
              mt='$5'
            >
              <HStack>
                <SeriesSvg />

                <Text color='$gray200' ml='$2'>3 Séries</Text>
              </HStack>

              <HStack> 
                <RepetitionSvg /> 

                <Text >12 Repetição</Text>
              </HStack>
            </HStack>

            <Button title='Marcar como realizado' />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}