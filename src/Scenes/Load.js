class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

       

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("torta_tiles", "torta1.jpg");
        this.load.image("simi_tiles","drsimi.png");
      
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");


        this.load.image("food", "food.png");
        this.load.image("umbrella", "tile_0065.png");


        // For animation
        this.load.image("explosion00", "explosion00.png");
        this.load.image("explosion01", "explosion01.png");
        this.load.image("explosion02", "explosion02.png");
        this.load.image("explosion03", "explosion03.png");


        //Load sound
        this.load.audio("walkingSound", "footstep_carpet_002.ogg");
        this.load.audio("coinSound", "confirmation_002.ogg");
        this.load.audio("umbrellaSound", "drop_003.ogg");
        this.load.audio("hurtSound", "error_003.ogg");
        this.load.audio("playerExplode","explosionCrunch_001.ogg");
        this.load.audio("jumpingJack1", "forceField_001.ogg");
        this.load.audio("jumpingJack2", "forceField_002.ogg");
        this.load.audio("jumping1", "phaseJump1.ogg");
        this.load.audio("jumping2", "phaseJump2.ogg");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 9,
                end: 10,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0009.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0010.png" }
            ],
        });



        this.anims.create({
            key: 'jumpingJacks',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 4, // Starting frame index
                end: 5, // Ending frame index
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 10,
            repeat: -1
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}