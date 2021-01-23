/** ========================================================================
 * class representing a color used in particles and consisting of red, blue, green, and alpha channels
 */
class Color {
    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * Create a new color
     * @param {*} r
     * @param {*} g
     * @param {*} b
     * @param {*} a
     */
    constructor(r, g, b, a=1) {
        this._r = r || 0;
        this._g = g || 0;
        this._b = b || 0;
        this.a = a;
        this.calcHSL();
    }

    // STATIC PROPERTIES ---------------------------------------------------
    static get zero() {
        return new Color(0,0,0,0);
    }

    // STATIC METHODS ------------------------------------------------------
    static fromHSL(h, s, l, a=1) {
        let c = new Color();
        c._h = h;
        c._s = s;
        c._l = l;
        c.a = a;
        c.calcRGB();
        return c;
    }

    // PROPERTIES ----------------------------------------------------------
    get h() { return this._h; }
    set h(value) { this._h = value; this.calcRGB(); }
    get s() { return this._s; }
    set s(value) { this._s = value; this.calcRGB(); }
    get l() { return this._l; }
    set l(value) { this._l = value; this.calcRGB(); }

    get r() { return this._r; }
    set r(value) { this._r = value; this.calcHSL(); }
    get g() { return this._g; }
    set g(value) { this._g = value; this.calcHSL(); }
    get b() { return this._b; }
    set b(value) { this._b = value; this.calcHSL(); }

    // METHODS -------------------------------------------------------------
    /**
     * using instance RGB values, calculate corresponding HSL values
     */
    calcHSL() {
        let r = this.r/255;
        let g = this.g/255;
        let b = this.b/255;
        let max = Math.max(r, g, b)
        let min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if(max == min){
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        this._h = Math.round(h * 360);
        this._s = Math.round(s * 100);
        this._l = Math.round(l * 100);
    }

    /**
     * helper function to convert hue to rgb
     */
    hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    /**
     * using instance HSL values, calculate corresponding RGB values
     */
    calcRGB() {
        let h = this.h/360;
        let s = this.s/100;
        let l = this.l/100;
        let r, g, b;
        if (s == 0){
            r = g = b = l; // achromatic
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = this.hue2rgb(p, q, h + 1/3);
            g = this.hue2rgb(p, q, h);
            b = this.hue2rgb(p, q, h - 1/3);
        }
        this._r = Math.round(r * 255); 
        this._g = Math.round(g * 255); 
        this._b = Math.round(b * 255);
    }

    /**
     * create a copy of the current color
     */
    copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    /**
     * convert to string compatable w/ fillStyle/strokeStyle using HSL values
     */
    asHSL(ao) {
        return "hsla(" + this.h + "," + this.s + "%," + this.l + "%," + ((ao == undefined) ? this.a : ao) + ")";
    }

    /**
     * convert to string compatable w/ fillStyle/strokeStyle using HSL values
     */
    asRGB(ao) {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + ((ao == undefined) ? this.a : ao) + ")";
    }

    /**
     * convert to string compatable w/ fillStyle/strokeStyle
     */
    toString() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }
}

/** ========================================================================
 * class representing particle system
 * - all emitters and particles are managed and rendered under a single particle system.
 */
class ParticleSystem {
    // STATIC VARIABLES ----------------------------------------------------
    static _instance;

    // STATIC PROPERTIES ---------------------------------------------------
    static get instance() {
        if (!this._instance) this._instance = new this({});
        return this._instance;
    }

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * Create a new particle system
     */
    constructor(spec={}) {
        if (!ParticleSystem._instance) ParticleSystem._instance = this;
        this.dbg = Object.hasOwnProperty(spec, "dbg") ? spec.dbg : false;
        this.visiblePred = Object.hasOwnProperty(spec, "visiblePred") ? spec.visiblePred : () => true;
        this.items = [];
        this.active = [];
        this.dbgTimer = 0;
        return ParticleSystem._instance;
    }

    // METHODS -------------------------------------------------------------
    /**
     * Add a tracked particle or emitter
     * @param {*} p
     */
    add(p) {
        this.items.push(p);
    }

    /**
     * Remove a particle or emitter from tracked list
     * @param {*} p
     */
    remove(p) {
        let idx = this.items.indexOf(p);
        if (idx >= 0) this.items.splice(idx, 1);
    }

    /**
     * Execute the main update thread for all emitters/particles
     */
    update(ctx) {
        let dt = ctx.deltaTime;
        // iterate through tracked items
        let inactive = 0;
        for (let i=this.items.length-1; i>=0; i--) {
            const item = this.items[i];
            // skip inactive items
            if (!item.active) {
                inactive++;
                continue;
            }
            // update each object
            item.update(ctx);
            // if any items are done, remove them
            if (item.done) {
                this.items.splice(i, 1);
            }
        }
        if (this.dbg) {
            this.dbgTimer += dt;
            if (this.dbgTimer > 1000) {
                this.dbgTimer = 0;
                debug.log("objs: " + this.items.length + " inactive: " + inactive);
            }
        }
    }

    render(ctx) {
        // make sure particles don't impact the rest of the drawing code
        ctx.save();
        // iterate through tracked items
        this.items.filter(item => item.render
                                  && this.visiblePred(item)
                                  && this.active) // (skip drawing for emitters)
            .forEach(item => {
                item.render(ctx);
            });
        ctx.restore();
    }

}

/** ========================================================================
 * The base particle class
 */
class Particle {

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * Create a new particle
     * @param {*} spec.x - starting x position of particle
     * @param {*} spec.y - starting y position of particle
     * @param {*} spec.e - parent emitter of particle (if any) used to track position of particle
     */
    constructor(spec={}) {
        this._x = spec.x || 0;
        this._y = spec.y || 0;
        this.e = spec.e;
        this._done = false;
        this._active = true;
    }

    // PROPERTIS -----------------------------------------------------------
    /**
     * Indicates if the particle has completed its life-cycle (and can be discarded)
     */
    get done() {
        return this._done;
    }
    set done(value) {
        this._done = (value) ? true : false;
    }

    /**
     * Indicates if the particle is active
     */
    get active() {
        if (this.e && !this.e.active) return false;
        return this._active;
    }

    get x() {
        return this._x + ((this.e) ? this.e.x : 0);
    }
    set x(value) {
        this._x = value - ((this.e) ? this.e.x : 0);
    }
    get y() {
        return this._y + ((this.e) ? this.e.y : 0);
    }
    set y(value) {
        this._y = value - ((this.e) ? this.e.y : 0);
    }
}

/** ========================================================================
 * A particle emitter class which is responsible for generating new particles
 * based on a generator function and timing intervals.
 */
class ParticleEmitter extends Particle {

    // CONSTRUCTOR ---------------------------------------------------------
    /**
     * Create a new particle emitter
     * @param {*} spec.psys - link to the particle system
     * @param {*} spec.genFcn - particle generator function
     * @param {*} spec.interval - interval (in milliseconds) between particle generation
     * @param {*} spec.jitter - percentage of interval to create a jitter between particle generation.  0 would indicate no jitter, 1 would indicate an interval between 0 and 2x interval.
     * @param {*} spec.ttl - emitter lifetime (in milliseconds), defaults to 0 which means no lifetime.
     * @param {*} spec.count - number of particles to emit per interval
     */
    constructor(spec={}) {
        super(spec);
        this.psys = spec.psys || ParticleSystem.instance;
        this.genFcn = spec.genFcn;
        this.interval = spec.interval || 500;
        this.jitter = (spec.jitter) ? spec.jitter/100 : 0;
        this.ttl = spec.ttl || 0;
        this.count = spec.count || 1;
        this.currentTick = 0;
        this._done = false;
        // compute next time to emit
        this.tte = 0;
        this.nextTTE();
        // keep track of particles emitter has generated
        this.particles = [];
        this.first = true;
    }

    /**
     * computes new time to emit based on interval and jitter
     */
    nextTTE() {
        this.tte = this.interval;
        if (this.jitter) {
            let ij = this.jitter * this.interval;
            this.tte += ((Math.random() * ij * 2) - ij);
        }
        if (this.tte < 1) this.tte = 1; // minimum interval;
    }


    /**
     * Indicates if the emitter has completed its life-cycle (and can be discarded)
     */
    get done() {
        return this._done;
    }
    set done(value) {
        this._done = (value) ? true : false;
    }

    /**
     * run generator to emit particle
     */
    emit() {
        if (!this.genFcn) return;
        for (let i=0; i<this.count; i++) {
            let p = this.genFcn(this);
            if (p) this.psys.add(p);
        }
    }

    /**
     * Update the particle emitter.  This is where new particles get generated based on the emitter schedule.
     */
    update(ctx) {
        // emit on first iteration
        if (this.first) {
            this.first = false;
            this.emit();
        }
        // don't update if emitter is done
        if (this.done) return;
        let dt = ctx.deltaTime;
        // update running emitter lifetime (if set)
        if (this.ttl) {
            this.ttl -= dt;
            if (this.ttl <= 0) {
                this._done = true;
                return;
            }
        }
        // update tte
        this.tte -= dt;
        // run generator if tte is zero
        if (this.tte <= 0) {
            this.emit();
            // compute next tte
            this.nextTTE();
        }
    }
}

class PeteParticle extends Particle {
    /**
     * Create a new fade particle
     * @param {*} spec.x - starting x position of particle
     * @param {*} spec.y - starting y position of particle
     * @param {*} spec.dx - delta x in pixels per second, speed of particle
     * @param {*} spec.dy - delta y in pixels per second, speed of particle
     * @param {*} spec.size - size of particle (radius in pixels)
     * @param {*} spec.color  - color for particle
     * @param {*} spec.ttl - lifetime of particle, in milliseconds
     */
    constructor(spec={}) {
        super(spec);
        this.dx = (spec.dx || 0) * .001;
        this.dy = (spec.dy || 0) * .001;
        this.size = spec.size || 5;
        this.color = spec.color || new Color(255,0,0,1);
        // bounds
        this.minx = spec.minx || 0;
        this.miny = spec.miny || 0;
        this.maxx = spec.maxx || 400;
        this.maxy = spec.maxy || 400;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(ctx) {
        let dt = ctx.deltaTime;
        // update position
        this.x += Math.round((this.dx * dt));
        this.y += Math.round((this.dy * dt));
        // update direction;
        if (this.x <= this.minx) this.dx = Math.abs(this.dx);
        if (this.y <= this.miny) this.dy = Math.abs(this.dy);
        if (this.x >= this.maxx) this.dx = -(Math.abs(this.dx));
        if (this.y >= this.maxy) this.dy = -(Math.abs(this.dy));
    }
}

/** ========================================================================
 * A particle for a circle that starts at a given position then slowly fades out
 */
class FadeParticle extends Particle {
    /**
     * Create a new fade particle
     * @param {*} spec.x - starting x position of particle
     * @param {*} spec.y - starting y position of particle
     * @param {*} spec.dx - delta x in pixels per second, speed of particle
     * @param {*} spec.dy - delta y in pixels per second, speed of particle
     * @param {*} spec.size - size of particle (radius in pixels)
     * @param {*} spec.color  - color for particle
     * @param {*} spec.ttl - lifetime of particle, in milliseconds
     */
    constructor(spec={}) {
        super(spec);
        this.dx = (spec.dx || 0) * .001;
        this.dy = (spec.dy || 0) * .001;
        this.size = spec.size || 5;
        this.color = spec.color || new Color(255,0,0,1);
        this.ttl = spec.ttl || 1000;
        this.fade = this.color.a;
        this.fadeRate = this.fade/this.ttl;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(ctx) {
        let dt = ctx.deltaTime;
        if (this.done) return;
        // update position
        this.x += (this.dx * dt);
        this.y += (this.dy * dt);
        // fade... slowly fade to nothing
        this.fade -= (dt * this.fadeRate);
        this.color.a = this.fade;
        // time-to-live
        this.ttl -= dt;
        if (this.ttl <= 0) {
            this._done = true;
        }
    }

}