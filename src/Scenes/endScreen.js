class endScreen extends Phaser.Scene {
    constructor() {
        super("endScreen");
        this.my = {sprite: {}};
        this.update = this.update.bind(this);
    }



    init(data) {
        this.finalScore = data.score;  // Save the passed score
    }

    create() {
        let my = this.my;
        this.nextScene = this.input.keyboard.addKey("SPACE");


        let centerX = this.game.config.width / 2;
        let centerY = this.game.config.height / 2;

        this.add.text(centerX, centerY - 300, "You did it", {
            fontFamily: '"Black Ops One", system-ui',
            fontSize: 70,
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: this.game.config.width }
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 200, "Score: " + this.finalScore, {
            fontFamily: '"Black Ops One", system-ui',
            fontSize: 50,
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: this.game.config.width }
        }).setOrigin(0.5);

        this.add.text(centerX, centerY + 50, "Press SPACE to Play Again", {
            fontFamily: "'Black Ops One'",
            fontSize: 30,
            align: 'center',
            wordWrap: { width: this.game.config.width }
        }).setOrigin(0.5);


    }


    
    update() {

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("platformerScene");
        }

    }

}