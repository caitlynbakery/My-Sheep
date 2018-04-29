var game = new Phaser.Game(720, 1280);

var GameState = {

    init: function(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.world.setBounds(0, 0, 720, 1280);

        this.score = 0;
        
        
    },

    preload: function(){

        this.load.spritesheet('sheep', 'assets/07-sheep_86x87x20.png', 86, 87, 20);
        this.load.image('button', 'assets/arrowButton.png');
        this.load.image('grass', 'assets/grass2.png');
        this.load.image('flower', 'assets/flower.png');
        this.load.image('mushroom', 'assets/mushroom.png');
        this.load.audio('music', 'assets/sound/music.mp3');
        this.load.audio('boing', 'assets/sound/boing.wav');
        this.load.audio('farm', 'assets/sound/farm-shorter.wav');
        

    },

    create: function(){
        this.add.image(0, 0, 'grass');

        this.flowers = this.add.group(); 
        this.flowers.enableBody = true;
        this.flowers.create(340, 204, 'flower');
        this.flowers.create(501, 405, 'flower');
        this.flowers.create(204, 701, 'flower');
        this.flowers.create(392, 924, 'flower');
        this.flowers.create(130, 1053, 'flower');

        this.mushrooms = this.add.group();
        this.mushrooms.enableBody = true;
        this.mushrooms.create(104, 104, 'mushroom');
        this.mushrooms.create(380, 620, 'mushroom');

        this.sheep = this.add.sprite(505, 705, 'sheep');
        
        this.sheep.animations.add('walk', [5, 6, 7], 8, true);
        this.sheep.animations.add('walkUp', [0, 1, 2], 8, true);
        this.sheep.animations.add('walkDown', [11, 12, 13], 8, true);
        this.downButton = this.add.button(495, 1085, 'button');
        this.upButton = this.add.button(495, 935, 'button');
        this.rightButton = this.add.button(600, 1005, 'button');
        this.leftButton = this.add.button(390, 1005, 'button');


        this.style = {font: 'bold 72px Arial', fill: 'white'};
        this.text = this.add.text(0, 0, "Score: " + this.score, this.style);
        

        this.music = this.add.audio('music');
        this.music.play();
        this.music.volume = 0.5;

        this.boing = this.add.audio('boing');
        this.boing.volume = 0.3;

        this.farm = this.add.audio('farm');
        

        this.game.physics.arcade.enable(this.sheep);
        this.sheep.anchor.setTo(0.5);
        
        this.game.physics.arcade.enable(this.flowers);
        this.game.physics.arcade.enable(this.mushrooms);
        this.flowers.setAll('body.immovable', true);
        this.flowers.setAll('body.allowGravity', false);

        this.mushrooms.setAll('body.immovable', true);
        

        
        this.sheep.body.collideWorldBounds = true;
        this.sheep.customParams = {isMovingLeft: false, isMovingRight: false,
    isMovingDown: false, isMovingUp: false, speed: 200};
    
 
    },

    update: function(){
        this.game.physics.arcade.collide(this.sheep, this.flowers, function(){
            this.boing.play();
            this.score = this.score + 1;
            this.changeDirection();

        }, null, this);
        this.game.physics.arcade.collide(this.sheep, this.mushrooms, function(){
            this.farm.play();
            this.score = this.score + 1;
            this.changeDirection();
        }, null, this);

        this.text.destroy();
        this.text = this.add.text(0, 0, "Score: " + this.score, this.style);
        
        if(this.cursors.right.isDown || this.sheep.customParams.isMovingRight){
            this.sheep.body.velocity.x = this.sheep.customParams.speed;
            this.sheep.scale.setTo(1, 1);
            this.sheep.animations.play('walk');
        }

        else if(this.cursors.left.isDown || this.sheep.customParams.isMovingLeft){
            this.sheep.body.velocity.x = -this.sheep.customParams.speed;
            this.sheep.scale.setTo(-1, 1);
            this.sheep.animations.play('walk');
        }

        else if(this.cursors.up.isDown || this.sheep.customParams.isMovingUp){
            this.sheep.body.velocity.y = -this.sheep.customParams.speed;
            this.sheep.animations.play('walkUp');
        }

        else if(this.cursors.down.isDown || this.sheep.customParams.isMovingDown){
            this.sheep.body.velocity.y = this.sheep.customParams.speed;
            this.sheep.animations.play('walkDown');
        }

        else{
            this.sheep.frame = 11;
            this.sheep.body.velocity.x = 0;
            this.sheep.body.velocity.y = 0;
        }
        this.leftButton.events.onInputDown.add(function(){
            this.sheep.customParams.isMovingLeft = true;
          
        }, this);

        this.leftButton.events.onInputUp.add(function(){
            this.sheep.customParams.isMovingDown = false;
            this.sheep.customParams.isMovingUp = false;
            this.sheep.customParams.isMovingLeft = false;
            this.sheep.customParams.isMovingRight = false;
        }, this);

        this.rightButton.events.onInputDown.add(function(){
            this.sheep.customParams.isMovingRight = true;
        }, this);

        this.rightButton.events.onInputUp.add(function(){
            this.sheep.customParams.isMovingDown = false;
            this.sheep.customParams.isMovingUp = false;
            this.sheep.customParams.isMovingLeft = false;
            this.sheep.customParams.isMovingRight = false;
        }, this);

        this.upButton.events.onInputDown.add(function(){
            this.sheep.customParams.isMovingUp = true;
        }, this);

        this.upButton.events.onInputUp.add(function(){
            this.sheep.customParams.isMovingUp = false;
            this.sheep.customParams.isMovingDown = false;
            this.sheep.customParams.isMovingLeft = false;
            this.sheep.customParams.isMovingRight = false;
        }, this);

        this.downButton.events.onInputDown.add(function(){
            this.sheep.customParams.isMovingDown = true;
        }, this);

        this.downButton.events.onInputUp.add(function(){
            this.sheep.customParams.isMovingDown = false;
            this.sheep.customParams.isMovingUp = false;
            this.sheep.customParams.isMovingLeft = false;
            this.sheep.customParams.isMovingRight = false;

        }, this);

    },

    changeDirection: function(){
        if(this.sheep.customParams.isMovingRight == true){
            this.sheep.customParams.isMovingRight = false;
            this.sheep.customParams.isMovingLeft = true;
            console.log('hi');
        }
        else if(this.sheep.customParams.isMovingLeft == true){
            this.sheep.customParams.isMovingLeft = false;
            this.sheep.customParams.isMovingRight = true;
        }
        else if(this.sheep.customParams.isMovingUp == true){
            this.sheep.customParams.isMovingUp = false;
            this.sheep.customParams.isMovingDown = true;
        }
        else if(this.sheep.customParams.isMovingDown == true){
            this.sheep.customParams.isMovingDown = false;
            this.sheep.customParams.isMovingUp = true;
        }
        
    }
}

game.state.add('GameState', GameState);
game.state.start('GameState');