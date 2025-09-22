import { handleShipPlacment, handleOkBtnClick } from "./event-handlers";

const mainEl = document.querySelector('main');
const dialog = document.querySelector('dialog');
const okBtn = document.querySelector('button');

const renderGameboard = () => {
  const container = document.createElement('div');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.setAttribute('class', 'cell');
      cell.setAttribute('data-coordinates', `${j}${i}`);
      cell.addEventListener('click', handleShipPlacment)
      container.appendChild(cell);
    };
  };
  mainEl.appendChild(container);
  const clone = container.cloneNode(true);
  clone.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleShipPlacment);
  });
  mainEl.appendChild(clone);
};

function showDialog() {
  dialog.showModal();
};

okBtn.addEventListener('click', handleOkBtnClick);

export { renderGameboard, showDialog };