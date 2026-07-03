import './styles.css';
import { renderGameboard } from './game-controller';

window.onload = () => {
  document.querySelector('body').classList.remove('preload');
  renderGameboard();
};