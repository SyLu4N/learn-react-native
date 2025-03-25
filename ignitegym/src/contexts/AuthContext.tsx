import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from '@storage/storageAuthToken';
import { storageUserGet, storageUserRemove, storageUserSave } from '@storage/storageUser';
import { createContext, ReactNode, useEffect, useState } from 'react';

export type AuthContextType = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  isLoadingUserStorageData: boolean;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [ user, setUser ] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(false);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    setUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    setIsLoadingUserStorageData(true);

    try {
      await storageUserSave(userData);
      await storageAuthTokenSave(token);
    } catch (error) {
     throw error; 
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function storageUserAndTokenRemove() {
    setIsLoadingUserStorageData(true);

    try {
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
     throw error; 
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    setIsLoadingUserStorageData(true);
    
    try {
      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

      if (userLogged && token) userAndTokenUpdate(userLogged, token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password });

      if (data.user && data.token) {
        setIsLoadingUserStorageData(true);

        await storageUserAndTokenSave(data.user, data.token);
        await userAndTokenUpdate(data.user, data.token);
      }
    } catch (error) {
      throw error;
    }
  }
  
  async function signOut() {
    try {
      await userAndTokenUpdate({} as UserDTO, '');
      await storageUserAndTokenRemove();
    } catch (error) {
      throw error;
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
    } catch (error) {
      throw error;
    }
  }
  
  useEffect(() => {
    loadUserData();
  }, []);

  return(
    <AuthContext.Provider 
      value={{ 
        user,
        signIn, 
        isLoadingUserStorageData, 
        signOut, 
        updateUserProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}