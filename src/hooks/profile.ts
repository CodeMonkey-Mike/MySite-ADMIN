import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { UPDATE_PROFILE } from 'src/graphql/mutation/profile.mutation';

export const useProfile = () => {
  const router = useRouter();
  const [UpdateProfile, { data: profileData, loading: profileLoading }] = useMutation(
    UPDATE_PROFILE
  );
  const onUpdate = useCallback(
    async (values) => {
      await UpdateProfile({
        variables: {
          ...values,
        },
      });
      router.back();
    },
    [UpdateProfile, router]
  );
  return {
    onUpdate,
    profileLoading,
    profileData,
  };
};
