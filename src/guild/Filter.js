class Filters {

    constructor(player,options = {}) {
        this._8d =options._8d|| null;
        this.bassboost = options.bassboost || null;
        this.player = player;
        this.node = player.node
        this.volume = player.volume ?? 1.0 ;
        this.equalizer = options.equalizer || [];
        this.karaoke = options.karaoke || null;
        this.timescale = options.timescale || null;
        this.tremolo = options.tremolo || null;
        this.vibrato = options.vibrato || null;
        this.rotation = options.rotation || null;
        this.distortion = options.distortion || null;
        this.channelMix = options.channelMix || null;
        this.lowPass = options.lowPass || null;
      }


    setEqualizer(bands){
        this.equalizer = bands;
        this.updateFilters();
        return this;
    }
    setKaraoke(karaoke) {
        this.karaoke = karaoke|| null;
        this.updateFilters();
        return this;
    }
    setTimescale(timescale) {
        this.updateFilters();
        this.timescale = timescale || null;
        return this;
    }
    setTremolo(tremolo) {
        this.tremolo = tremolo || null;
        this.updateFilters();
        return this;
    }

    setVibrato(vibrato){
        this.vibrato = vibrato || null;
        this.updateFilters();
        return this;
    }

    setRotation(rotation) {
        this.rotation = rotation || null;
        this.updateFilters();
        return this;
    }
    setDistortion(distortion) {
        this.distortion = distortion || null;
        this.updateFilters();
        return this;
    }

    setChannelMix(mix) {
        this.channelMix = mix || null;
        this.updateFilters();
        return this;
    }

    setLowPass(pass) {
        this.lowPass = pass || null;
        this.updateFilters();
        return this;
    }

    setFilters(options) {
        this.player.filters = new Filters(options);
        this.updateFilters();
        return this;
    }

    clearFilters() {
        this.player.filters = new Filters();
        this.node.send({
            op: "filters",
            guildId: this.player.guild
        });
        return this;
    }
    setNightcore(val) {
        if (!this.player) return;
        this.setTimescale(val ? { rate: 1.5 } : null);
        this.nightcore = val;
        if (val) {
          this.doubleTime = false;
          this.vaporwave = false;
        }
        return this
      }

      setSlowmode(val) {
        if (!this.player) return;
        this.slowmode = val;
        if (val) {
        }
        this.setFilters(
          val
            ? {
                timescale: {
                  speed: 0.5,
                  pitch: 1.0,
                  rate: 0.8,
                },
              }
            : this.clearFilters()
        );
      }

      setVaporwave(val) {
        if (!this.player) return;
        this.vaporwave = val;
        if (val) {
          this.doubleTime = false;
          this.nightcore = false;
        }
        this.setTimescale(val ? { pitch: 0.5 } : null);
      }
    
      set8D(val) {
        if (!this.player) return;
        this._8d = val;
        this.setRotation(val ? { rotationHz: 0.2 } : null);
      }

    setBassboost(val) {
        if (!this.player) return;
        this.bassboost = !!val;
        this.bassboost = val / 100;
        this.player.setEqualizer(
          val
            ? Array(6)
                .fill(0.22)
                .map((x, i) => ({ band: i, gain: x * val }))
            : []
        );
      }

    updateFilters(){
        const { volume, equalizer, karaoke, timescale, tremolo, vibrato, rotation, distortion, channelMix, lowPass } = this;
        this.node.send({
            op:"filters",
            guildId: this.player.guild,
            volume,
            equalizer,
            karaoke,
            timescale,
            tremolo,
            vibrato,
            rotation,
            distortion,
            channelMix,
            lowPass
        });
    }


}




module.exports = Filters;
