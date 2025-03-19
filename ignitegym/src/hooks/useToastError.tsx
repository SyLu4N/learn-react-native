import { ToastMessage } from '@components/ToastMessage';
import { useToast } from '@gluestack-ui/themed'

type Props = {
  title: string;
  onClose?: () => void;
  description?: string;
}

export function useToastError() {
  const toast = useToast();

  return ({ title, onClose, description }: Props) => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <ToastMessage 
          id={id} 
          title={title} 
          action='error' 
          onClose={onClose ?? (() => toast.close(id))}
          description={description}
        />
      )
    });
  }
}