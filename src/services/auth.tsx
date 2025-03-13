import { Amplify } from 'aws-amplify';
import { 
  signUp as awsSignUp, 
  signIn as awsSignIn, 
  signOut as awsSignOut, 
  confirmSignUp as awsConfirmSignUp, 
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  getCurrentUser as awsGetCurrentUser
} from 'aws-amplify/auth';
import awsConfig from '../aws/aws-exports.js';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: awsConfig.aws_user_pools_id,
      userPoolClientId: awsConfig.aws_user_pools_web_client_id,
      signUpVerificationMethod: 'code',
    }
  },
  Analytics: {
    disabled: true,
  }
});

export const signUp = async (email: string, password: string, name: string) => {
  console.log('signUp called with:', { email, password, name });
  try {
    const response = await awsSignUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name,
        }
      }
    });
    console.log('Sign up successful:', response);
    return response;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { isSignedIn, nextStep } = await awsSignIn({ 
      username: email, 
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH"
      }
    });
    
    if (__DEV__) console.log('Sign in result:', { isSignedIn, nextStep });
    return { isSignedIn, nextStep };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    return await awsSignOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const confirmSignUp = async (email: string, code: string) => {
  try {
    const response = await awsConfirmSignUp({
      username: email,
      confirmationCode: code
    });
    console.log('Email verification successful:', response);
    return response;
  } catch (error) {
    console.error('Error confirming sign up:', error);
    throw error;
  }
};

export const resendVerificationCode = async (email: string) => {
  try {
    await resendSignUpCode({ username: email });
    console.log('Verification code resent successfully');
    return true;
  } catch (error) {
    console.error('Error resending code:', error);
    throw error;
  }
};

export const handleUserSignUp = async (email: string, password: string, name: string) => {
  try {
    return await signUp(email, password, name);
  } catch (error) {
    if (error.name === 'UsernameExistsException') {
      try {
        await resendVerificationCode(email);
        return { isUnconfirmedUser: true };
      } catch (resendError) {
        throw resendError;
      }
    }
    throw error;
  }
};

export async function initiateForgotPassword(email: string) {
  try {
    const result = await resetPassword({ username: email });
    console.log('Reset password initiated:', result);
    return result;
  } catch (error) {
    console.error('Error initiating password reset:', error);
    throw error;
  }
}

export async function submitNewPassword(email: string, code: string, newPassword: string) {
  try {
    const result = await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword
    });
    console.log('Password reset successful:', result);
    return result;
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
}

export const getCurrentUser = async () => {
  try {
    const currentUser = await awsGetCurrentUser();
    return currentUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};