import { createContext, useContext, useEffect, useState } from 'react';

import { apiGet } from '../api/http';

const MerchantContext = createContext(null);

export const MerchantProvider = ({ children }) => {
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

  const fetchMerchantProfile = async () => {
    try {
      const res = await apiGet('/method/iswitch.merchant_portal_api.get_merchant_profile');
      setMerchant(res.data.message);
    } catch (error) {
      console.error('Merchant profile fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.role == 'Merchant') {
          setRole('user');
        } else if (parsedUser?.role == 'Admin') {
          setRole('admin');
        } else {
          setRole('user');
        }
      } catch (e) {
        console.error('Invalid user data in localStorage');
      }
    }
    fetchMerchantProfile();
  }, []);




  return (
    <MerchantContext.Provider
      value={{
        merchant,
        loading,
        refetchMerchant: fetchMerchantProfile,
        setMerchant,
        role,
        setRole
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => useContext(MerchantContext);
