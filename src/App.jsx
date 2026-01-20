import { RouterProvider } from 'react-router-dom';

import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { MerchantProvider } from './context/MerchantContext';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <ThemeCustomization>
      <MerchantProvider>
        <ScrollTop>
           <Toaster position="top-right" reverseOrder={false} />
          <RouterProvider router={router} />
        </ScrollTop>
      </MerchantProvider>
    </ThemeCustomization>
  );
}
