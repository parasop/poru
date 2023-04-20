import { Player } from "./Player";

interface Band {
  bands: number;
  gain: number;
}
interface karaokeOptions {
  level: number;
  monoLevel: number;
  filterBand: number;
  filterWidth: number;
}

interface timescaleOptions {
  speed?: number;
  pitch?: number;
  rate?: number;
}

interface tremoloOptions {
  frequency: number;
  depth: number;
}

interface vibratoOptions {
  frequency: number;
  depth: number;
}

interface rotationOptions {
  rotationHz: number;
}
interface distortionOptions {
  sinOffset?: number;
  sinScale?: number;
  cosOffset?: number;
  cosScale?: number;
  tanOffset?: number;
  tanScale?: number;
  offset?: number;
  scale?: number;
}

export interface channelMixOptions {
  leftToLeft?: number;
  leftToRight?: number;
  rightToLeft?: number;
  rightToRight?: number;
}

interface FiltersOptions {
   volume: number;
   equalizer: Band[];
   karaoke: karaokeOptions;
   tremolo: tremoloOptions;
   vibrato: vibratoOptions;
   rotation: rotationOptions;
   distortion: distortionOptions;
   channelMix: channelMixOptions;
   lowPass: lowPassOptions;
   timescale: timescaleOptions;

}

interface lowPassOptions {
  smoothing: number;
}
export class Filters {
  public player: Player;
  public volume: number;
  public equalizer: Band[];
  public karaoke: karaokeOptions;
  public tremolo: tremoloOptions;
  public vibrato: vibratoOptions;
  public rotation: rotationOptions;
  public distortion: distortionOptions;
  public channelMix: channelMixOptions;
  public lowPass: lowPassOptions;

  public timescale: timescaleOptions;

  constructor(player,options?:FiltersOptions) {
    this.player = player;
    (this.volume = 1.0),
     (this.equalizer = []);
    this.karaoke = options?.karaoke || null;
    this.timescale = options?.timescale || null;
    this.tremolo = options?.tremolo || null;
    this.vibrato = options?.vibrato || null;
    this.rotation =options?.rotation || null;
    this.distortion =options?.distortion || null;
    this.channelMix = options?.channelMix || null;
    this.lowPass = options?.lowPass || null;
  }

  public setEqualizer(bands: Band[]): Filters {
 
        this.equalizer = bands;
        this.updateFilters();
        return this;
  }


 /**
     * Change the karaoke Options applied to the currently playing track
     * @param karaoke An object that conforms to the KaraokeOptions type that defines a range of frequencies to mute
     * @returns The current filter instance
     */
  public setKaraoke(karaoke?: karaokeOptions): Filters {
    this.karaoke = karaoke|| null;
    this.updateFilters();
    return this;
}

public setTimescale(timescale?: timescaleOptions): Filters {
    this.timescale = timescale || null;
    this.updateFilters();
    return this;
}

public setTremolo(tremolo?: tremoloOptions):Filters {
    this.tremolo = tremolo || null;
    this.updateFilters();
    return this;
}

public setVibrato(vibrato?: vibratoOptions): Filters {
    this.vibrato = vibrato || null;
    this.updateFilters();
    return this;
}

public setRotation(rotation?: rotationOptions): Filters {
    this.rotation = rotation || null;
    this.updateFilters();

    return this;
}

public setDistortion(distortion: distortionOptions): Filters {
    this.distortion = distortion || null;
    this.updateFilters();

    return this;
}


public setChannelMix(mix: channelMixOptions):Filters {
    this.channelMix = mix || null;
    this.updateFilters();

    return this;
}

public setLowPass(pass: lowPassOptions): Filters{
    this.lowPass = pass || null;
    this.updateFilters();

    return this;
}

public setFilters(options) {
  this.player.filters = this.player.poru.options.customFilter ? new this.player.poru.options.customFilter(this,options) : new Filters(this,options);
  this.updateFilters();
  return this;
}


public clearFilters(): Filters {
    this.player.filters = new Filters(this.player);
    this.updateFilters()
    return this;
}


  public updateFilters():Filters{

    const {equalizer,karaoke,timescale,tremolo,vibrato,rotation,distortion,channelMix,lowPass,volume} = this;

    this.player.node.rest.updatePlayer({
        guildId :this.player.guildId,
        data:{filters:{ volume,equalizer,karaoke,timescale,tremolo,vibrato,rotation,distortion,channelMix,lowPass,
    }}
})
return this;
  }
}
