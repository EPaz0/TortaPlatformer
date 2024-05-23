class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
        this.foodCounter = 0;
        this.jumps = 0; 
        this.canDoubleJump = false; 
        this.lastWalkingSoundTime = 0;
        this.PlayerScore = 0;
    }

    init() {
        // variables and settings
        this.ACCELERATION = 200;
        this.DRAG = 1000;
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.ORIGINAL_SCALE = 1;
    }

    createShield() {
        this.shield = this.add.sprite(my.sprite.player.x + 20, my.sprite.player.y, "umbrella");
        this.shield.setScale(3); 
        this.shield.setVisible(false);
        this.shield.setFlipY(true);
        this.shield.setPosition(-100, -100);
        this.physics.add.existing(this.shield, false);
        this.shield.body.setAllowGravity(false);
        this.shield.body.immovable = true;
    }

    hideShield() {
        this.shield.setVisible(false);
        this.shield.setPosition(-100, -100);
        this.shieldActive = false;
        this.shieldCooldown = true;

        this.time.delayedCall(3000, () => {
            this.shieldCooldown = false;
        }, [], this);
    }

    createFood() {
        let camera = this.cameras.main;
        let xMin = camera.worldView.x;
        let xMax = camera.worldView.x + camera.width;

        let xPosition = Phaser.Math.Between(xMin, xMax);
        
        let food = this.physics.add.sprite(xPosition, 0, "food");
        food.setVelocity(0, 100);
        food.setInteractive();
        this.physics.add.collider(food, this.groundLayer, function (food) {
            food.destroy();
        });
        this.physics.add.overlap(my.sprite.player, food, this.eatFood, null, this);
        this.physics.add.collider(this.shield, food, (shield, food) => {
            food.destroy();
            this.sound.play("umbrellaSound", { volume: 1 });
        }, null, this);
    }

    onPlayerGroundCollision() {
        this.jumps = 0;
        this.canDoubleJump = true;
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        document.getElementById('description').innerHTML = '<br>Collect Coin and get to the flag // Arrow Left: left // Arrow Right: right // Space: umbrella blocks rain // Arrow Down: Jumping jacks help lose weight';

        this.map = this.add.tilemap("platformer-level-1", 18, 18, 3600, 522);

        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.tortaTileset = this.map.addTilesetImage("torta1", "torta_tiles");
        this.simiTileset = this.map.addTilesetImage("drsimi", "simi_tiles");
        this.bgLayer = this.map.createLayer("background", this.tileset, 0, 0);

        const tintLayer = this.add.graphics();
        tintLayer.fillStyle(0xf70539, 0.6);
        tintLayer.fillRect(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        this.drsimi = this.map.createLayer("simi", this.simiTileset, 0, 0);
        this.torta = this.map.createLayer("torta", this.tortaTileset, 0, 0).setScrollFactor(.8);
        this.pipesLayer = this.map.createLayer("BackgroundMountain", this.tileset, 0, 0).setScrollFactor(.8);
        this.sunLayer = this.map.createLayer("Sun", this.tileset, 0, 0);
        this.waterFallsLayer = this.map.createLayer("backGroundWaterFalls", this.tileset, 0, 0).setScrollFactor(1);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        this.groundLayer.setCollisionByProperty({ collides: true });

        this.animatedTiles.init(this.map);

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        this.water = this.map.createFromObjects("Water", {
            name: "water",
            key: "tilemap_sheet",
            frame: 73
        });

        this.spike = this.map.createFromObjects("Spikes", {
            name: "spike",
            key: "tilemap_sheet",
            frame: 68
        });

        this.flag = this.map.createFromObjects("Finish", {
            name: "flag",
            key: "tilemap_sheet",
            frame: 131
        });

        this.entrance = this.map.createFromObjects("Secret", {
            name: "entrance",
            key: "tilemap_sheet",
            frame: 151
        });

        this.exit = this.map.createFromObjects("return", {
            name: "exit",
            key: "tilemap_sheet",
            frame: 151
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        this.physics.world.enable(this.water, Phaser.Physics.Arcade.STATIC_BODY);
        this.waterGroup = this.add.group(this.water);

        this.physics.world.enable(this.spike, Phaser.Physics.Arcade.STATIC_BODY);
        this.spikeGroup = this.add.group(this.spike);

        this.physics.world.enable(this.flag, Phaser.Physics.Arcade.STATIC_BODY);
        this.flagGroup = this.add.group(this.flag);

        this.physics.world.enable(this.entrance, Phaser.Physics.Arcade.STATIC_BODY);
        this.entranceGroup = this.add.group(this.entrance);

        this.physics.world.enable(this.exit, Phaser.Physics.Arcade.STATIC_BODY);
        this.exitGroup = this.add.group(this.exit);

        my.sprite.player = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0009.png");
        my.sprite.player.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.physics.add.collider(my.sprite.player, this.groundLayer, this.onPlayerGroundCollision, null, this);

        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy();
            this.foodCounter = 0;
            my.sprite.player.setScale(1, 1);
            this.PlayerScore = 1 + this.PlayerScore;
            this.sound.play("coinSound", { volume: 1 });
        });

        this.physics.add.overlap(my.sprite.player, this.flagGroup, (obj1, obj2) => {
            this.foodCounter = 0;
            my.sprite.player.setScale(1, 1);
            this.sound.play("coinSound", { volume: 1 });
            this.scene.start("endScreen", { score: this.PlayerScore });
        });

        this.physics.add.overlap(my.sprite.player, this.entranceGroup, (obj1, obj2) => {
            my.sprite.player.setPosition(2783, 695);
            this.sound.play("coinSound", { volume: 1 });
        });

        this.physics.add.overlap(my.sprite.player, this.exitGroup, (obj1, obj2) => {
            my.sprite.player.setPosition(2947, 366);
            this.sound.play("coinSound", { volume: 1 });
        });

        this.physics.add.overlap(my.sprite.player, this.waterGroup, this.playerHitWater, null, this);
        this.physics.add.overlap(my.sprite.player, this.spikeGroup, this.playerHitWater, null, this);

        cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }, this);

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            scale: { start: 0.03, end: 0.1 },
            lifespan: 350,
            alpha: { start: 1, end: 0.1 },
        });

        my.vfx.walking.stop();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(100, 300);
        this.cameras.main.setZoom(this.SCALE);
        this.cameras.main.scrollY -= 260;

        this.createShield();

        this.foodTimer = this.time.addEvent({
            delay: 20,                // Spawn a food item every 2000 milliseconds (2 seconds)
            callback: this.createFood,
            callbackScope: this,
            loop: true
        });

        this.anims.create({
            key: "puff",
            frames: [
                { key: "explosion00" },
                { key: "explosion01" },
                { key: "explosion02" },
                { key: "explosion03" },
            ],
            framerate: 30,
            repeat: 5,
            hideOnComplete: true
        });

        this.shield.setVisible(false);
        this.shield.setPosition(-100, -100);
        this.shieldActive = false;
        this.shieldCooldown = false;

        this.physics.world.createDebugGraphic();
    }

    eatFood(player, food) {
        food.destroy();
        this.foodCounter += 1;
        player.setScale(player.scaleX + 0.1, player.scaleY + 0.1);
        this.sound.play("hurtSound", { volume: 1 });

        if (player.scaleX > 3) {
            this.physics.pause();
            this.sound.play("playerExplode", { volume: 1 });
            this.puff = this.add.sprite(player.x, player.y, "explosion03").setScale(0.25).play("puff");
            this.time.delayedCall(1000, () => this.scene.restart(), [], this);
        }
    }

    playerHitWater(player, water) {
        this.physics.pause();
        this.sound.play("playerExplode", { volume: 1 });
        this.puff = this.add.sprite(player.x, player.y, "explosion03").setScale(0.25).play("puff");
        this.time.delayedCall(1000, () => this.scene.restart(), [], this);
    }

    update() {
        let sizeFactor = my.sprite.player.scaleX;

        if (sizeFactor === this.ORIGINAL_SCALE) {
            this.acceleration = this.ACCELERATION;
            this.drag = this.DRAG;
            this.jumpVelocity = this.JUMP_VELOCITY;
        } else {
            this.acceleration = this.ACCELERATION / sizeFactor;
            this.drag = this.DRAG * sizeFactor;
            this.jumpVelocity = this.JUMP_VELOCITY / sizeFactor;
        }

        const currentTime = this.time.now;

        if (cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.acceleration);
            my.sprite.player.resetFlip();

            console.log("Playing walk animation"); // Debugging log
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

            if (this.shield.visible) {
                this.shield.setPosition(my.sprite.player.x - 10, my.sprite.player.y - 5);
            }

            if (currentTime - this.lastWalkingSoundTime > 300) {
                this.sound.play("walkingSound", { volume: 1 });
                this.lastWalkingSoundTime = currentTime;
            }
        } else if (cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.acceleration);
            my.sprite.player.setFlip(true, false);

            console.log("Playing walk animation"); // Debugging log
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth / 2 - 10, my.sprite.player.displayHeight / 2 - 5, true);
            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

            if (this.shield.visible) {
                this.shield.setPosition(my.sprite.player.x + 10, my.sprite.player.y - 5);
            }

            if (currentTime - this.lastWalkingSoundTime > 300) {
                this.sound.play("walkingSound", { volume: 1 });
                this.lastWalkingSoundTime = currentTime;
            }
        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.drag);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();

            if (this.shield.visible) {
                this.shield.setPosition(my.sprite.player.x + 10, my.sprite.player.y - 5);
            }
        }

        if (my.sprite.player.body.blocked.down) {
            this.jumps = 0;
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if (my.sprite.player.body.blocked.down || this.jumps < 1) {
                this.sound.play("jumping1", { volume: 1 });
                my.sprite.player.setVelocityY(this.jumpVelocity);
                this.jumps++;
            } else if (this.jumps === 1 && this.canDoubleJump) {
                this.sound.play("jumping2", { volume: 1 });
                my.sprite.player.setVelocityY(this.jumpVelocity);
                this.jumps++;
                this.canDoubleJump = false;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        if (cursors.down.isDown && my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jumpingJacks', true);

            if (my.sprite.player.scaleX > 1) {
                my.sprite.player.setScale(my.sprite.player.scaleX - 0.01, my.sprite.player.scaleY - 0.01);

                if (currentTime - this.lastWalkingSoundTime > 250) {
                    this.sound.play("jumpingJack1", { volume: 1 });
                    this.lastWalkingSoundTime = currentTime;
                }
            }
        } else {
           // my.sprite.player.anims.play('idle');
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && !this.shieldActive && !this.shieldCooldown) {
            this.shield.setVisible(true);
            this.shieldActive = true;

            this.time.delayedCall(2000, () => {
                this.hideShield();
            }, [], this);
        }
    }
}