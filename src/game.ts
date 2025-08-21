import {
  Scene,
  Engine,
  Actor,
  Color,
  Font,
  FontUnit,
  GraphicsGroup,
  Text,
  vec,
  Sprite,
} from "excalibur";

import {
  frogImage,
  mainButtonImage,
  mainButtonSpiderImage,
  mainButtonWizzardImage,
  mainButtonVaderImage,
  buttonImage,
  buttonRedImage,
  buttonWhiteImage,
  buttonYellowImage,
  buttonOffImage,
  spiderLockedImage,
  wizzardLockedImage,
  vaderLockedImage,
} from "./resources";

interface Upgrade {
  name: string;
  cost: number;
  level: number;
  effect: () => void;
}

interface Skin {
  name: string;
  cost: number;
  mainSprite: Sprite;
  buttonSprite: Sprite;
  unlocked: boolean;
}

export class GameScene extends Scene {
  private score: number = 0;
  private scoreMultiplier: number = 1;
  private scoreText!: Text;

  private upgradeButtons: Actor[] = [];
  private upgradeLabels: Text[] = [];
  private upgradeButtonBackgrounds: Sprite[] = [];
  private upgrades: Upgrade[] = [];

  private skins: Skin[] = [];
  private mainButton!: Actor;

  onInitialize(engine: Engine) {
    // === Score ===
    this.scoreText = new Text({
      text: `${this.score}`,
      font: new Font({
        size: 32,
        unit: FontUnit.Px,
        family: "Amphibiafont",
        color: Color.White,
      }),
    });

    const scoreIcon = new Actor({
      pos: vec(30, 30),
      width: 24,
      height: 24,
    });
    const frogSprite = frogImage.toSprite();
    frogSprite.width = 36;
    frogSprite.height = 24;
    scoreIcon.graphics.use(frogSprite);
    this.add(scoreIcon);

    const scoreActor = new Actor({
      pos: vec(scoreIcon.pos.x + 40, 30),
      anchor: vec(0, 0.5),
    });
    scoreActor.graphics.use(this.scoreText);
    this.add(scoreActor);

    // === Botão principal ===
    const mainButtonSize = Math.min(engine.drawWidth, engine.drawHeight) * 0.4;
    this.mainButton = new Actor({
      width: mainButtonSize,
      height: mainButtonSize,
      pos: vec(engine.drawWidth / 2, engine.drawHeight / 2 - 160),
    });
    this.mainButton.pointer.useGraphicsBounds = true;

    const mainSprite = mainButtonImage.toSprite();
    mainSprite.width = mainButtonSize;
    mainSprite.height = mainButtonSize;
    this.mainButton.graphics.use(mainSprite);
    this.add(this.mainButton);

    this.mainButton.on("pointerup", () => {
      this.score += 1 * this.scoreMultiplier;
      this.scoreText.text = `${this.score}`;
      this.mainButton.actions.scaleTo(1.05, 1.05, 15, 15).scaleTo(1, 1, 5, 5);
      this.updateUpgradeButtons();
    });

    // === Definir upgrades ===
    this.setupUpgrades(engine);

    // === Definir skins ===
    this.setupSkins(engine);

    // === Botões de upgrade 2x2 ===
    this.createUpgradeButtons(engine);

    // === Botões da loja de skins (opcional, pode ser UI lateral ou popup) ===
    this.createSkinButtons(engine);
  }

  // === Upgrades ===
  private setupUpgrades(engine: Engine) {
    this.upgrades = [
      {
        name: "Multiplicador +1",
        cost: 10,
        level: 0,
        effect: () => {
          this.scoreMultiplier++;
        },
      },
      {
        name: "Auto Click 1/s",
        cost: 50,
        level: 0,
        effect: () => {
          setInterval(() => {
            this.score += 1 * this.scoreMultiplier;
            this.scoreText.text = `${this.score}`;
            this.updateUpgradeButtons();
          }, 1000);
        },
      },
      {
        name: "Multiplicador +5",
        cost: 200,
        level: 0,
        effect: () => {
          this.scoreMultiplier += 5;
        },
      },
      {
        name: "Auto Click 5/s",
        cost: 1000,
        level: 0,
        effect: () => {
          setInterval(() => {
            this.score += 5 * this.scoreMultiplier;
            this.scoreText.text = `${this.score}`;
            this.updateUpgradeButtons();
          }, 1000);
        },
      },
    ];
  }

  // === Skins ===
  private setupSkins(engine: Engine) {
    this.skins = [
      {
        name: "Default",
        cost: 0,
        mainSprite: mainButtonImage.toSprite(),
        buttonSprite: buttonImage.toSprite(),
        unlocked: true,
      },
      {
        name: "Skin Homem-Aranha",
        cost: 100,
        mainSprite: mainButtonSpiderImage.toSprite(),
        buttonSprite: buttonRedImage.toSprite(),
        unlocked: false,
      },
      {
        name: "Skin Harry Potter",
        cost: 500,
        mainSprite: mainButtonWizzardImage.toSprite(),
        buttonSprite: buttonYellowImage.toSprite(),
        unlocked: false,
      },
      {
        name: "Skin Darth Vader",
        cost: 1000,
        mainSprite: mainButtonVaderImage.toSprite(),
        buttonSprite: buttonWhiteImage.toSprite(),
        unlocked: false,
      },
    ];

    // Aplica a skin default
    this.applySkin(0);
  }

  private applySkin(index: number) {
    const skin = this.skins[index];

    // === Atualiza o botão principal ===
    if (this.mainButton) {
      const mainSprite = skin.mainSprite.clone();
      mainSprite.width = this.mainButton.width;
      mainSprite.height = this.mainButton.height;
      this.mainButton.graphics.use(mainSprite);
    }

    // === Atualiza os botões de upgrade ===
    for (let i = 0; i < this.upgradeButtons.length; i++) {
      const upgradeBtn = this.upgradeButtons[i];
      const label = this.upgradeLabels[i];

      // clona o sprite do botão da skin
      const bgSprite = skin.buttonSprite.clone();
      bgSprite.width = upgradeBtn.width;
      bgSprite.height = upgradeBtn.height;

      // recria o GraphicsGroup para combinar fundo + texto centralizado
      const graphic = new GraphicsGroup({
        members: [
          { graphic: bgSprite, offset: vec(0, 0) },
          {
            graphic: label,
            offset: vec(upgradeBtn.width / 2 - 50, upgradeBtn.height / 2 - 15),
          },
        ],
      });

      upgradeBtn.graphics.use(graphic);
    }
  }

  private buySkin(index: number) {
    const skin = this.skins[index];
    if (!skin.unlocked && this.score >= skin.cost) {
      this.score -= skin.cost;
      skin.unlocked = true;
      this.scoreText.text = `${this.score}`;
      this.applySkin(index);
    }
  }

  // === Cria botões de upgrade ===
  private createUpgradeButtons(engine: Engine) {
    const cols = 2;
    const spacingX = 15;
    const spacingY = 15;

    const btnWidth = engine.drawWidth * 0.4;
    const btnHeight = btnWidth * 0.8;
    const startY = this.mainButton.pos.y + this.mainButton.height / 2 + 40;

    for (let i = 0; i < this.upgrades.length; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const totalWidth = cols * btnWidth + (cols - 1) * spacingX;
      const startX = (engine.drawWidth - totalWidth) / 2;

      const x = startX + col * (btnWidth + spacingX);
      const y = startY + row * (btnHeight + spacingY);

      const upgradeBtn = new Actor({
        width: btnWidth,
        height: btnHeight,
        pos: vec(x + btnWidth / 2, y + btnHeight / 2),
        anchor: vec(0.5, 0.5),
      });
      upgradeBtn.pointer.useGraphicsBounds = true;

      const label = new Text({
        text: `${this.upgrades[i].name}\nCusto: ${this.upgrades[i].cost}`,
        font: new Font({
          size: 14,
          unit: FontUnit.Px,
          family: "Amphibiafont",
          color: Color.White,
        }),
      });
      this.upgradeLabels.push(label);

      const bgSprite = buttonOffImage.toSprite();
      bgSprite.width = btnWidth;
      bgSprite.height = btnHeight;
      this.upgradeButtonBackgrounds.push(bgSprite);

      upgradeBtn.graphics.use(
        new GraphicsGroup({
          members: [
            { graphic: bgSprite, offset: vec(0, 0) },
            {
              graphic: label,
              offset: vec(btnWidth / 2 - 50, btnHeight / 2 - 15),
            },
          ],
        })
      );

      upgradeBtn.on("pointerup", () => this.buyUpgrade(i));

      this.upgradeButtons.push(upgradeBtn);
      this.add(upgradeBtn);
    }
  }

  // === Botões de skin ===
  private createSkinButtons(engine: Engine) {
    const btnSize = 60;
    const spacing = 20;
    const startX = 60;
    const startY = engine.drawHeight - btnSize - 20;

    this.skins.forEach((skin, i) => {
      const skinBtn = new Actor({
        width: btnSize,
        height: btnSize,
        pos: vec(startX + i * (btnSize + spacing), startY),
      });
      skinBtn.pointer.useGraphicsBounds = true;

      // === Sprite da skin ou locked ===
      let sprite: Sprite;
      if (skin.unlocked) {
        sprite = skin.mainSprite.clone();
      } else {
        switch (i) {
          case 1:
            sprite = spiderLockedImage.toSprite();
            break;
          case 2:
            sprite = wizzardLockedImage.toSprite();
            break;
          case 3:
            sprite = vaderLockedImage.toSprite();
            break;
          default:
            sprite = buttonOffImage.toSprite();
        }
      }
      sprite.width = btnSize;
      sprite.height = btnSize;
      skinBtn.graphics.use(sprite);

      // === Texto do preço ===
      let priceActor: Actor | null = null;
      if (skin.cost > 0) {
        const priceText = new Text({
          text: skin.unlocked ? "" : `${skin.cost}`,
          font: new Font({
            size: 14,
            unit: FontUnit.Px,
            family: "Amphibiafont",
            color: Color.White,
          }),
        });

        priceActor = new Actor({
          pos: vec(skinBtn.pos.x, skinBtn.pos.y + btnSize / 2 + 12),
          anchor: vec(0.5, 0),
        });
        priceActor.graphics.use(priceText);
        this.add(priceActor);
      }

      // === Clique ===
      skinBtn.on("pointerup", () => {
        if (skin.unlocked) {
          this.applySkin(i);
        } else {
          this.buySkin(i);
          if (skin.unlocked) {
            // Troca o sprite para o desbloqueado
            const unlockedSprite = skin.mainSprite.clone();
            unlockedSprite.width = btnSize;
            unlockedSprite.height = btnSize;
            skinBtn.graphics.use(unlockedSprite);

            // Remove o preço da tela
            if (priceActor) {
              priceActor.kill();
            }
          }
        }
      });

      this.add(skinBtn);
    });
  }

  // === Comprar upgrade ===
  private buyUpgrade(index: number) {
    const upgrade = this.upgrades[index];
    if (this.score >= upgrade.cost) {
      this.score -= upgrade.cost;
      this.scoreText.text = `${this.score}`;
      upgrade.level++;
      upgrade.effect();
      upgrade.cost = Math.floor(upgrade.cost * 1.5);

      this.upgradeLabels[
        index
      ].text = `${upgrade.name}\nCusto: ${upgrade.cost}`;
      this.updateUpgradeButtons();
    }
  }

  private updateUpgradeButtons() {
    for (let i = 0; i < this.upgrades.length; i++) {
      const btn = this.upgradeButtons[i];
      const upg = this.upgrades[i];
      const bgSprite = this.upgradeButtonBackgrounds[i];

      if (this.score < upg.cost) {
        btn.pointer.useGraphicsBounds = false;
        bgSprite.image = buttonOffImage;
      } else {
        btn.pointer.useGraphicsBounds = true;
        bgSprite.image = buttonImage;
      }
    }
  }
}
