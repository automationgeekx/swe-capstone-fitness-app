import { Alert } from 'react-native';

interface CustomAlertProps {
  title: string;
  message: string;
  type: 'error' | 'success';
}

const showCustomAlert = ({ title, message, type }: CustomAlertProps) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        style: 'default',
      }
    ],
    {
      cancelable: true,
    }
  );
};

export default showCustomAlert; 