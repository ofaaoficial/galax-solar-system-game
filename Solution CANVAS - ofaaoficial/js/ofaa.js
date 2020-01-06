const el = e => document.querySelector(e);
const cl = cl => console.log(cl);
const on = (el, evnt, func) => el.addEventListener(evnt, func);

const canvas = el('#canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

class Elemento {
    constructor(img, x, y, w, h, speed = 3) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speed = speed;
    }

    Dibujar() {
        ctx.save();
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        ctx.restore();
    }
}

class Background extends Elemento {
    constructor(...props) {
        super(...props);
    }

    Dibujar(i) {
        ctx.save();
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        if (this.y < 0) {
            this.y += this.speed;

        }else{
            GAME.start = false;
            el('.modal-dialog').style.display = 'flex';
            el('.failed').style.display = 'none';
            el('.start').style.display = 'none';
            el('.congratulations').style.display = 'block';

            el('#restart').style.display = 'block';

        }
        ctx.restore();
    }
}

class Star extends Elemento {
    constructor(...props) {
        super(...props);
    }

    Dibujar(i) {
        ctx.save();
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        if (this.y > -this.h) this.y -= this.speed;
        ctx.restore();
    }
}

class Spacecraft extends Elemento {
    constructor(...props) {
        super(...props);
        this.frame = 0;
        this.angle = 0;
    }

    Dibujar(i) {
        ctx.save();

        // ctx.rotate(this.angle * Math.PI / 180);
        ctx.drawImage(this.img, this.frame * this.w / 3, 0, this.w / 3, this.h, this.x, this.y, this.w / 3, this.h);
        this.frame++;
        if (this.frame == 2) this.frame = 0;
        ctx.restore();
    }
}

class Rocket extends Elemento{
    constructor(...props) {
        super(...props);
    }

    Dibujar(i) {
        ctx.save();
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        this.y > 0 ? this.y-= 5 : delete GAME.rockets[i] ;
        ctx.restore();
    }

    ValidateColition(i, Obj = false, ObjI){
        if(!Obj) return;
        if(
            this.y + this.h > Obj.y
            &&
            this.y < Obj.y + Obj.h
            &&
            this.x + this.w / 4 > Obj.x
            &&
            this.x < Obj.x + Obj.w / 3
        ){
            delete GAME.rockets[i];
            delete GAME.asteroids[ObjI];
        }
    }
}


class Asteroid extends Elemento{
    constructor(...props) {
        super(...props);
        this.frame = 0;
    }

    Dibujar(i) {
        ctx.save();
        ctx.drawImage(this.img, this.frame * this.w / 4, 0, this.w / 4, this.h, this.x, this.y, this.w / 4, this.h);
        this.frame++;
        if (this.frame == 3) this.frame = 0;
        this.y < canvas.height ? this.y += 5 : delete GAME.asteroids[i];
        ctx.restore();
    }

    ValidateColition(i){
        let Obj = GAME.elements[2];

        if(
            this.y + this.h > Obj.y
            &&
            this.y < Obj.y + Obj.h
            &&
            this.x + this.w / 4 > Obj.x
            &&
            this.x < Obj.x + Obj.w / 3
        ){
            el('.modal-dialog').style.display = 'flex';
            el('.failed').style.display = 'block';
            el('#restart').style.display = 'block';
            el('.start').style.display = 'none';
            GAME.start = false;
        }
    }

}




class Text extends Elemento{
    constructor(...props){
        super(...props);
        this.opacity = 0;
        this.coor = 0;
    }
    Dibujar(){
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        if(this.y > this.coor) this.opacity += 0.01;
        if(this.y < canvas.height) this.y+= 3;
        ctx.restore();
    }
}

const img = (name) => {
    let img = new Image();
    img.src = `imgs/${name}.png`;
    return img;
}

const random = (min, max) => Math.round( Math.random() * (max - min) + min );

const GAME = {
    start: false,
    elements: [
        new Star(img('stars'), 0, 0, canvas.width, 5585),
        new Background(img('solarsystem'), 0, -6000, canvas.width, 6000),
        new Spacecraft(img('spacecraft'), (canvas.width / 2) - 101, canvas.height - 100, 301, 101),
        new Text(img('uranus_text'), canvas.width - 500, -600, 419, 228, 200),
        new Text(img('saturn_text'), 50, -1600, 419, 228, 200),
        new Text(img('jupiter_text'), canvas.width - 500, -2600, 419, 228, 200),
        new Text(img('mars_text'), 50, -3600, 419, 228, 200),
        new Text(img('earth_text'), canvas.width - 500, -4600, 419, 228, 200),
    ],
    rockets: [],
    asteroids: [],
    keys: {
        left: false,
        right: false,
    },
    init() {
        GAME.start = true;

        on(document, 'keydown', (e) => {
            switch (e.code) {
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
                case 'Space':
                    this.rockets.push(new Rocket(img('rocket'),this.elements[2].x  + 44 ,this.elements[2].y - 20, 17, 32));
                    break;
            }
        });

        on(document, 'keyup', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
            }
        });

        let loopAsteroids = setInterval(()=>{ this.asteroids.push(new Asteroid(img('asteroid'), random(100, canvas.width - 100), -10, 401, 100)); },5000);

        requestAnimationFrame(loopGame);
    }
}




const loopGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (GAME.keys.left) {
        GAME.elements[2].x -= 6;
        GAME.elements[2].angle = -20;
    }
    if (GAME.keys.right) {
        GAME.elements[2].x += 6;
        GAME.elements[2].angle = 20;
    }

    for (let i in GAME.elements) {
        GAME.elements[i].Dibujar(i);

    }

    for (let i in GAME.asteroids) {
        GAME.asteroids[i].ValidateColition(i);
        GAME.asteroids[i].Dibujar(i);
    }

    for (let x in GAME.rockets) {
        GAME.rockets[x].Dibujar(x);
        for (let i in GAME.asteroids) {
            if (!GAME.rockets[x]) break;

            GAME.rockets[x].ValidateColition(x, GAME.asteroids[i], i);
        }

    }

    if (GAME.start) requestAnimationFrame(loopGame);
}

el('#start').onclick = ()=>{
    GAME.init();
    el('.modal-dialog').style.display = 'none';
}

el('#restart').onclick = ()=>{
    location.reload();
}
