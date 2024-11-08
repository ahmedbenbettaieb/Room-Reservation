import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from "@mantine/core";
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { Provider } from 'react-redux';
import { store } from './pages/redux/store.ts';
import { AuthContextProvider } from './contexts/authContext.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
  <MantineProvider stylesTransform={emotionTransform}>
    <MantineEmotionProvider>
      <Notifications />
      <ModalsProvider>
        <AuthContextProvider>
        <App />
        </AuthContextProvider>
      </ModalsProvider>
    </MantineEmotionProvider>
  </MantineProvider>
  </Provider>

)
