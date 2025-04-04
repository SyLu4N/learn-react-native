import { useState } from 'react';
import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from '@gluestack-ui/themed';
import { Controller, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { Alert } from 'react-native';

import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import BackgroundImg from '@assets/background.png';
import Logo from '@assets/logo.svg';

import { AppError } from '@utils/AppError';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { api } from '@services/api';
import { ToastMessage } from '@components/ToastMessage';
import { useAuth } from '@hooks/useAuth';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o email').email('Email inválido'),

  password: yup
    .string()
    .required('Informe a senha')
    .min(6, 'A senha precisa ter pelo menos 6 dígitos'),

  password_confirm: yup
    .string()
    .required('Confirme a senha')
    .oneOf([yup.ref('password'), ''], 'As senhas precisam ser iguais'),
    
})

export function SignUp() {
  const { signIn } = useAuth();
  const navigator = useNavigation<AuthNavigationRoutesProps>();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  function handleGoBack() {
    navigator.goBack();
  }

  async function handleSignUp({ name, email, password }: FormDataProps) {
    setIsLoading(true);

    try {
      await api.post('/users', { name, email, password });
      await signIn(email, password);
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;
      const message = isAppError ? error.message : 'Não foi possivel criar a conta. Tente novamente mais tarde.';

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage 
            title={message} 
            action='error' 
            id={id} 
            onClose={() => toast.close(id)} 
          />
        )
      })
    }
  }

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }} 
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image 
          source={BackgroundImg} 
          defaultSource={BackgroundImg} // Memoriza imagem
          alt="Pessoas Treinando" 
          w="$full"
          h={624}
          position='absolute'
        />

        <VStack flex={1} px='$10' pb='$16'>
          <Center my='$24'>
            <Logo />

            <Text color='$gray100' fontSize='$sm'>
              Treine sua mente e o seu corpo
            </Text>
          </Center>

          <Center gap='$2' flex={1}>
            <Heading color='$gray100'>Crie sua conta</Heading>

            <Controller
              control={control}
              name='name'
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder='Nome' 
                  onChangeText={onChange} 
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder='E-mail' 
                  keyboardType='email-address' 
                  autoCapitalize='none'
                  onChangeText={onChange} 
                  value={value} 
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder='Senha' 
                  secureTextEntry 
                  autoCapitalize='none'
                  onChangeText={onChange} 
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='password_confirm'
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder='Confirme a senha' 
                  secureTextEntry
                  autoCapitalize='none'
                  onChangeText={onChange} 
                  value={value} 
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType='send'
                  errorMessage={errors.password_confirm?.message}
                />
              )}
            />

            <Button 
              title="Criar e acessar" 
              onPress={handleSubmit(handleSignUp)} 
              isLoading={isLoading}
            />
          </Center>

          <Button 
            title="Voltar para o login" 
            variant='outline' 
            mt='$12' 
            onPress={handleGoBack}
          />
        </VStack>
      </VStack>
    </ScrollView>
  );
}