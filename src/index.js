import './styles.css';
import { renderGameboard, showDialog } from './dom-manipulator';

window.onload = () => {
  renderGameboard();
  showDialog();
};