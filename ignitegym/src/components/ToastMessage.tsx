import { ToastDescription, ToastTitle, Toast, Pressable, Icon, VStack, HStack } from '@gluestack-ui/themed';
import { X } from 'lucide-react-native';

type Props = {
  id: string;
  title: string;
  description?: string;
  action?: 'error' | 'success';
  onClose: () => void;
}

export function ToastMessage({
  description, 
  action = 'success', 
  onClose,   
  title, 
  id,
}: Props) {
  return (
    <Toast 
      nativeID={`toast-${id}`} 
      action={action} 
      bgColor={action === 'error' ? '$red500' : '$green500'}
      mt='$10'
    >
      <VStack>
        <ToastTitle color='$white' fontFamily='$heading'>
          {title}
        </ToastTitle>

        {description && (
          <ToastDescription color='$white' fontFamily='$body'>
            {description}
          </ToastDescription>
        )}
      </VStack>

      <Pressable 
        onPress={onClose} 
        alignSelf='flex-end' 
        position='absolute' 
        top={-4} 
        right={-4}
        bgColor={action === 'error' ? '$red500' : '$green500'}
        rounded='$full'
        p={3}
        borderWidth={3}
        borderColor='$gray600'
      >
        <Icon as={X} color='$coolGray50' size='2xs' />
      </Pressable>
    </Toast>
  );
}