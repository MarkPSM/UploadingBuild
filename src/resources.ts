import { ImageSource, Loader } from "excalibur";
import frogURL from "./images/sapo.png";
import wizzardURL from "./images/bruxo.png";
import vaderURL from "./images/darth vage.png";
import spiderURL from "./images/miranha.png";
import buttonURL from "./images/button.png";
import buttonRedURL from "./images/buttonRed.png";
import buttonWhiteURL from "./images/buttonWhite.png";
import buttonYellowURL from "./images/buttonYellow.png";
import buttonOffURL from "./images/buttonOff.png";
import mainButtonURL from "./images/mainButton.png";
import mainButtonSpiderURL from "./images/mainButtonSpider.png";
import mainButtonWizzardURL from "./images/mainButtonWizzard.png";
import mainButtonVaderURL from "./images/mainButtonVader.png";
import spiderLockedURL from "./images/spiderLocked.png";
import wizzardLockedURL from "./images/wizzardLocked.png";
import vaderLockedURL from "./images/vaderLocked.png";

export const frogImage = new ImageSource(frogURL);
export const wizzardImage = new ImageSource(wizzardURL);
export const vaderImage = new ImageSource(vaderURL);
export const spiderImage = new ImageSource(spiderURL);

export const buttonImage = new ImageSource(buttonURL);
export const buttonRedImage = new ImageSource(buttonRedURL);
export const buttonWhiteImage = new ImageSource(buttonWhiteURL);
export const buttonYellowImage = new ImageSource(buttonYellowURL);
export const buttonOffImage = new ImageSource(buttonOffURL);

export const mainButtonImage = new ImageSource(mainButtonURL);
export const mainButtonSpiderImage = new ImageSource(mainButtonSpiderURL);
export const mainButtonWizzardImage = new ImageSource(mainButtonWizzardURL);
export const mainButtonVaderImage = new ImageSource(mainButtonVaderURL);
export const spiderLockedImage = new ImageSource(spiderLockedURL);
export const wizzardLockedImage = new ImageSource(wizzardLockedURL);
export const vaderLockedImage = new ImageSource(vaderLockedURL);

// It is convenient to put your resources in one place
export const Resources = {
  Frog: frogImage,
  Wizzard: wizzardImage,
  Vader: vaderImage,
  Spider: spiderImage,

  Button: buttonImage,
  ButtonRed: buttonRedImage,
  ButtonWhite: buttonWhiteImage,
  ButtonYellow: buttonYellowImage,
  ButtonOff: buttonOffImage,

  MainButton: mainButtonImage,
  MainButtonSpider: mainButtonSpiderImage,
  MainButtonWizzard: mainButtonWizzardImage,
  MainButtonVader: mainButtonVaderImage,
  SpiderLocked: spiderLockedImage,
  WizzardLocked: wizzardLockedImage,
  VaderLocked: vaderLockedImage,

  // Vite public/ directory serves the root images
} as const; // the 'as const' is a neat typescript trick to get strong typing on your resources.
// So when you type Resources.Sword -> ImageSource

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader([
  frogImage,
  wizzardImage,
  vaderImage,
  spiderImage,

  buttonImage,
  buttonRedImage,
  buttonWhiteImage,
  buttonYellowImage,
  buttonOffImage,

  mainButtonImage,
  mainButtonSpiderImage,
  mainButtonWizzardImage,
  mainButtonVaderImage,
]);
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
