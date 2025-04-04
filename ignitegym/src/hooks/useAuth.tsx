import { AuthContext } from '@contexts/AuthContext';
import { useContext } from 'react';

export function useAuth() {
    const { signIn, user, isLoadingUserStorageData, signOut, updateUserProfile } = useContext(AuthContext);
   
    return { signIn, user, isLoadingUserStorageData, signOut, updateUserProfile };
}