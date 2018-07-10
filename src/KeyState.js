export default class KeyState {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    window.addEventListener('keydown', e => {
      let k = e.key;
      if (k == "ArrowLeft") this.left = true;
      if (k == "ArrowRight") this.right = true;
      if (k == "ArrowUp") this.up = true;
      if (k == "ArrowDown") this.down = true;
    });

    window.addEventListener('keyup', e => {
      let k = e.key;
      if (k == "ArrowLeft") this.left = false;
      if (k == "ArrowRight") this.right = false;
      if (k == "ArrowUp") this.up = false;
      if (k == "ArrowDown") this.down = false;
    });
  }

}
