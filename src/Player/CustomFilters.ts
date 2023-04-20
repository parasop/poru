import { Player} from "./Player";
import { Filters } from "./Filters";


export class customFilter extends Filters {
  public band: number;
  public gain: number;
  public slowmode: boolean;
  public nightcore: boolean;
  public vaporwave: boolean;
  public _8d: boolean;
  public bassboost: number;
  constructor(player: Player) {
    super(player);
    this.player = player;
  }

  public setSlowmode(val: boolean): this {
    if (!this.player) return;
    this.slowmode = val;

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

  setNightcore(val) {
    if (!this.player) return;
    this.nightcore = val;

    this.setTimescale(val ? { rate: 1.5 } : null);
    if (val) {
      this.vaporwave = false;
    }
    return val;
  }

  setVaporwave(val: boolean) {
    if (!this.player) return;
    this.vaporwave = val;
    if (val) {
      this.nightcore = false;
    }
    this.setTimescale(val ? { pitch: 0.5 } : null);
  }

  set8D(val) {
    if (!this.player) return;
    this._8d = val;
    this.setRotation(val ? { rotationHz: 0.2 } : null);
  }
}