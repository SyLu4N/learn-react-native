import { ComponentProps } from 'react';

import { Button as GluestackButton, Text, ButtonSpinner } from '@gluestack-ui/themed'

interface Props extends ComponentProps<typeof GluestackButton> {
  title: string;
  isLoading?: boolean
  variant?: 'solid' | 'outline';
}

export function Button({ 
  title, 
  isLoading = false, 
  variant = 'solid',  
  ...rest 
}: Props) {
  return(
    <GluestackButton 
      w='$full'
      h='$14'
      bg={variant === 'outline' ? 'transparent' : '$green700'}
      borderWidth={variant === 'outline' ? '$1' : '$0' }
      opacity={isLoading ? 0.5 : 1}
      borderColor='$green500'
      rounded='$sm'
      $active-bg={variant === 'outline' ? '$gray500' : '$green500'}
      disabled={isLoading}
      {...rest} 
    >
      { isLoading ? (
        <ButtonSpinner color='$white' />
      ) : (
        <Text 
          color={variant === 'outline' ? '$green500' : '$white'} 
          fontFamily='$heading' 
          fontSize='$sm'
        >
          {title}
        </Text>
      )}
      
    </GluestackButton>
  );
}