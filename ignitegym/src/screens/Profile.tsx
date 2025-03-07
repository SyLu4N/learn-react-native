import { useState } from 'react';
import { Center, VStack, Text, useToast } from '@gluestack-ui/themed';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Heading } from '@gluestack-ui/themed';
import { launchImageLibraryAsync } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ToastMessage } from '@components/ToastMessage';

export function Profile() {
  const [userPhoto, setUserPhoto] = useState('https://github.com/SyLu4N.png');

  const toast = useToast();

  async function handleUserPhotoSelect() {
    try {
      const photoSelect = await launchImageLibraryAsync({
        mediaTypes: [ "images" ],
        quality: 1,
        aspect: [ 4, 4 ],
        allowsEditing: true,
        /* base64: true; */
      })
  
      if (photoSelect.canceled) return;
  
      const photoUri = photoSelect.assets[0].uri;
  
      if (photoUri) {
        const photoInfo = 
        await FileSystem.getInfoAsync(photoUri) as { size: number };
  
        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage 
                id={id}
                action='error' 
                title='Essa imagem e muito grande. escolha uma até de 5MB.'  
                onClose={() => toast.close(id)} 
              />
            )
          })
        }
  
        setUserPhoto(photoUri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possivel carregar a imagem no momento.');
    }
  }

  return(
    <VStack flex={1}>
      <ScreenHeader title='Perfil' />
 
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt='$6' px='$10'>
          <UserPhoto 
            source={{ uri: userPhoto }} 
            alt='Foto do usuário' 
            size='xl'
          />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text 
              color='$green500' 
              fontFamily='$heading' 
              fontSize='$md' 
              mt='$2'
              mb='$8'
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Center w='$full' gap='$4'>
            <Input placeholder='Nome' bg='$gray600' />

            <Input value='luaan.carlos@hotmail.com' bg='$gray600' isReadOnly />
          </Center>

          <Heading 
            alignSelf='flex-start' 
            fontFamily='$heading' 
            fontSize='$md' 
            color='$gray200'
            mt='$12'
          >
            Alterar senha
          </Heading>

          <Center w='$full' gap='$4'>
            <Input placeholder='Senha antiga' bg='$gray600' secureTextEntry />

            <Input placeholder='Nova senha' bg='$gray600' secureTextEntry />

            <Input placeholder='Confirme nova senha' bg='$gray600' secureTextEntry />

            <Button title='Salvar alterações' />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}