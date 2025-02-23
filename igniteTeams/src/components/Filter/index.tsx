import { TouchableOpacityProps } from 'react-native';
import { Container, Title, FilterStyleProps } from './styles';

interface FilterProps extends TouchableOpacityProps {
  isActive?: boolean;
  title: string;
}

export function Filter({ isActive = false, title, ...rest }: FilterProps) {
  return(
    <Container isActive={isActive} {...rest}>
      <Title>{title}</Title>
    </Container>
  );

}