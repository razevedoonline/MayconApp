import { Platform, Alert as RNAlert } from 'react-native';

/**
 * Utilitário de Alert que funciona em todas as plataformas (iOS, Android, Web/PWA)
 */
const Alert = {
  alert: (title, message, buttons = [{ text: 'OK' }], options = {}) => {
    if (Platform.OS === 'web') {
      // Para Web/PWA, usar window.confirm ou window.alert
      if (buttons.length === 1) {
        // Apenas um botão (OK)
        window.alert(message ? `${title}\n\n${message}` : title);
        if (buttons[0]?.onPress) {
          buttons[0].onPress();
        }
      } else if (buttons.length === 2) {
        // Dois botões (Cancel/OK ou similar)
        const cancelButton = buttons.find(b => b.style === 'cancel') || buttons[0];
        const confirmButton = buttons.find(b => b.style !== 'cancel') || buttons[1];
        
        const result = window.confirm(message ? `${title}\n\n${message}` : title);
        
        if (result) {
          if (confirmButton?.onPress) {
            confirmButton.onPress();
          }
        } else {
          if (cancelButton?.onPress) {
            cancelButton.onPress();
          }
        }
      } else {
        // Múltiplos botões - usar alert simples
        window.alert(message ? `${title}\n\n${message}` : title);
        // Executar o primeiro botão por padrão
        if (buttons[0]?.onPress) {
          buttons[0].onPress();
        }
      }
    } else {
      // Para iOS e Android, usar o Alert nativo
      RNAlert.alert(title, message, buttons, options);
    }
  },
};

export default Alert;

