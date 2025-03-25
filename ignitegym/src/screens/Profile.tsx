import { useState } from 'react';
import { Center, VStack, Text, useToast } from '@gluestack-ui/themed';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Heading } from '@gluestack-ui/themed';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { launchImageLibraryAsync } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import { api } from '@services/api';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ToastMessage } from '@components/ToastMessage';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { useToastError } from '@hooks/useToastError';

const profileSchema = yup
  .object({
    name: yup.string().required("Informe o nome"),

    password: yup
      .string()
      .min(6, "A senha deve ter pelo menos 6 dígitos.")
      .nullable()
      .transform((value) => (!!value ? value : null)),

    confirm_password: yup
      .string()
      .nullable()
      .transform((value) => (!!value ? value : null))
      .oneOf([yup.ref("password"), null], "As senhas devem ser iguais.")
      .when("password", {
        is: (Field: any) => Field,
        then: (schema) => schema
          .required("Informe a confirmação de senha.")
          .nullable()
          .transform((value) => (!!value ? value : null)),
      }),
  })
  .shape({
    email: yup.string().nonNullable().required(),
    old_password: yup.string().nullable(),
  });

type FormDataProps = yup.InferType<typeof profileSchema>

export function Profile() {
  const toast = useToast();
  const toastError = useToastError();
  const { user, updateUserProfile } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: { name: user.name, email: user.email },
    resolver: yupResolver(profileSchema)
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://github.com/SyLu4N.png');

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

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;
      
      await api.put('/users', data);
      await updateUserProfile(userUpdated);

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage 
            id={id}
            action='success' 
            title='Perfil atualizado com sucesso!'  
            onClose={() => toast.close(id)} 
          />
        )
      })
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possivel atualizar os dados, tente novamente mais tarde.';
      
      toastError({ title });
    } finally {
      setIsUpdating(false);
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
            <Controller 
              name='name' 
              control={control} 
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder='Nome' 
                  bg='$gray600' 
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )} 
            />

            <Controller 
              name='email' 
              control={control} 
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder='E-mail' 
                  bg='$gray600' 
                  isReadOnly
                  onChangeText={onChange}
                  value={value}
                />
              )} 
            />
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
            <Controller 
              name='old_password' 
              control={control} 
              render={({ field: { onChange } }) => (
                <Input 
                  onChangeText={onChange}
                  placeholder='Senha antiga'
                  bg='$gray600' 
                  secureTextEntry 
                  errorMessage={errors.old_password?.message}
                />
              )} 
            />

            <Controller 
              name='password' 
              control={control} 
              render={({ field: { onChange } }) => (
                <Input 
                  onChangeText={onChange}
                  placeholder='Nova senha' 
                  bg='$gray600' 
                  secureTextEntry 
                  errorMessage={errors.password?.message}
                />
              )} 
            />

            <Controller 
              name='confirm_password' 
              control={control} 
              render={({ field: { onChange } }) => (
                <Input 
                  onChangeText={onChange}
                  placeholder='Confirme nova senha' 
                  bg='$gray600' 
                  secureTextEntry 
                  errorMessage={errors.confirm_password?.message}
                />
              )} 
            />

            <Button 
              title='Salvar alterações'
              mt='$4'
              onPress={handleSubmit(handleProfileUpdate)} 
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}