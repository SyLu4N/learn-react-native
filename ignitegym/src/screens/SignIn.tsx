import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from '@gluestack-ui/themed';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';

import { AuthNavigationRoutesProps } from '@routes/auth.routes'

import Logo from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { ToastMessage } from '@components/ToastMessage';
import { useState } from 'react';

type FormDataProps = {
  email: string;
  password: string;
}

const signInSchema = yup.object({
  email: yup.string().required('Informe o E-mail').email('Email inválido'),
  password: yup
    .string()
    .required('Informe a Senha')
    .min(6, 'A senha precisa ter pelo menos 6 dígitos'),
})

export function SignIn() {
  const { signIn } = useAuth();
  const navigator = useNavigation<AuthNavigationRoutesProps>();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
      resolver: yupResolver(signInSchema)
  });

  async function handleSignIn(data: FormDataProps) {
    setIsLoading(true);

    try {
      await signIn(data.email, data.password);
    } catch (error) {
      setIsLoading(false);

      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.';
    
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage 
            title={title} 
            action='error' 
            id={id} 
            onClose={() => toast.close(id)} 
          />
        )
      })
    }
  }

  function handleNewAccount() {
    navigator.navigate('signUp');
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

          <Center gap='$2'>
            <Heading color='$gray100'>
              Acesse sua conta
            </Heading>

            <Controller
              control={control}
              name='email'
              render={({ field: { onChange, value } }) => (
                <Input 
                  onChangeText={onChange} 
                  value={value}
                  errorMessage={errors.email?.message}
                  placeholder='E-mail' 
                  keyboardType='email-address' 
                  autoCapitalize='none' 
                />
              )}
            />

            <Controller
              control={control}
              name='password'
              render={({field: { onChange, value }}) => (
                <Input 
                  placeholder='Senha' 
                  secureTextEntry 
                  errorMessage={errors.password?.message}
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  returnKeyType='send'
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Button 
              title="Acessar" 
              onPress={handleSubmit(handleSignIn)} 
              isLoading={isLoading} 
            />
          </Center>

          <Center flex={1} justifyContent='flex-end' mt='$4'>
            <Text 
              color='$gray100' 
              fontSize='$sm'
              mb='$3'
              fontFamily='$body'
            >
              Ainda não tem acesso?
            </Text>

            <Button 
              title="Criar Conta" 
              variant='outline' 
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}