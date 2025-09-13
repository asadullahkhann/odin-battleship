const mainEl = document.querySelector('main');
const dialog = document.querySelector('dialog');

const renderGameboard = () => {
  const Container = document.createElement('div');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.setAttribute('class', 'cell');
      cell.setAttribute('data-coordinates', `${i}${j}`);
      Container.appendChild(cell);
    }
  }
  mainEl.appendChild(Container);
  mainEl.appendChild(Container.cloneNode(true));
};

function showDialog() {
  dialog.showModal();
};

export { renderGameboard, showDialog };