[poru](../README.md) / [Exports](../modules.md) / customFilter

# Class: customFilter

The customFilters class that is used to apply filters to the currently playing track

## Hierarchy

- [`Filters`](Filters.md)

  ↳ **`customFilter`**

## Table of contents

### Constructors

- [constructor](customFilter.md#constructor)

### Properties

- [\_8d](customFilter.md#_8d)
- [band](customFilter.md#band)
- [bassboost](customFilter.md#bassboost)
- [channelMix](customFilter.md#channelmix)
- [distortion](customFilter.md#distortion)
- [equalizer](customFilter.md#equalizer)
- [gain](customFilter.md#gain)
- [karaoke](customFilter.md#karaoke)
- [lowPass](customFilter.md#lowpass)
- [nightcore](customFilter.md#nightcore)
- [player](customFilter.md#player)
- [rotation](customFilter.md#rotation)
- [slowmode](customFilter.md#slowmode)
- [timescale](customFilter.md#timescale)
- [tremolo](customFilter.md#tremolo)
- [vaporwave](customFilter.md#vaporwave)
- [vibrato](customFilter.md#vibrato)
- [volume](customFilter.md#volume)

### Methods

- [clearFilters](customFilter.md#clearfilters)
- [set8D](customFilter.md#set8d)
- [setBassboost](customFilter.md#setbassboost)
- [setChannelMix](customFilter.md#setchannelmix)
- [setDistortion](customFilter.md#setdistortion)
- [setEqualizer](customFilter.md#setequalizer)
- [setFilters](customFilter.md#setfilters)
- [setKaraoke](customFilter.md#setkaraoke)
- [setLowPass](customFilter.md#setlowpass)
- [setNightcore](customFilter.md#setnightcore)
- [setRotation](customFilter.md#setrotation)
- [setSlowmode](customFilter.md#setslowmode)
- [setTimescale](customFilter.md#settimescale)
- [setTremolo](customFilter.md#settremolo)
- [setVaporwave](customFilter.md#setvaporwave)
- [setVibrato](customFilter.md#setvibrato)
- [updateFilters](customFilter.md#updatefilters)

## Constructors

### constructor

• **new customFilter**(`player`): [`customFilter`](customFilter.md)

The customFilters class that is used to apply filters to the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | [`Player`](Player.md) | Player |

#### Returns

[`customFilter`](customFilter.md)

#### Overrides

[Filters](Filters.md).[constructor](Filters.md#constructor)

#### Defined in

src/Player/CustomFilters.ts:20

## Properties

### \_8d

• **\_8d**: `boolean`

#### Defined in

src/Player/CustomFilters.ts:14

___

### band

• **band**: `number`

#### Defined in

src/Player/CustomFilters.ts:9

___

### bassboost

• **bassboost**: `number`

#### Defined in

src/Player/CustomFilters.ts:15

___

### channelMix

• **channelMix**: [`channelMixOptions`](../interfaces/channelMixOptions.md)

#### Inherited from

[Filters](Filters.md).[channelMix](Filters.md#channelmix)

#### Defined in

src/Player/Filters.ts:170

___

### distortion

• **distortion**: `distortionOptions`

#### Inherited from

[Filters](Filters.md).[distortion](Filters.md#distortion)

#### Defined in

src/Player/Filters.ts:169

___

### equalizer

• **equalizer**: `Band`[]

#### Inherited from

[Filters](Filters.md).[equalizer](Filters.md#equalizer)

#### Defined in

src/Player/Filters.ts:164

___

### gain

• **gain**: `number`

#### Defined in

src/Player/CustomFilters.ts:10

___

### karaoke

• **karaoke**: `karaokeOptions`

#### Inherited from

[Filters](Filters.md).[karaoke](Filters.md#karaoke)

#### Defined in

src/Player/Filters.ts:165

___

### lowPass

• **lowPass**: `lowPassOptions`

#### Inherited from

[Filters](Filters.md).[lowPass](Filters.md#lowpass)

#### Defined in

src/Player/Filters.ts:171

___

### nightcore

• **nightcore**: `boolean`

#### Defined in

src/Player/CustomFilters.ts:12

___

### player

• **player**: [`Player`](Player.md)

#### Inherited from

[Filters](Filters.md).[player](Filters.md#player)

#### Defined in

src/Player/Filters.ts:162

___

### rotation

• **rotation**: `rotationOptions`

#### Inherited from

[Filters](Filters.md).[rotation](Filters.md#rotation)

#### Defined in

src/Player/Filters.ts:168

___

### slowmode

• **slowmode**: `boolean`

#### Defined in

src/Player/CustomFilters.ts:11

___

### timescale

• **timescale**: `timescaleOptions`

#### Inherited from

[Filters](Filters.md).[timescale](Filters.md#timescale)

#### Defined in

src/Player/Filters.ts:173

___

### tremolo

• **tremolo**: `tremoloOptions`

#### Inherited from

[Filters](Filters.md).[tremolo](Filters.md#tremolo)

#### Defined in

src/Player/Filters.ts:166

___

### vaporwave

• **vaporwave**: `boolean`

#### Defined in

src/Player/CustomFilters.ts:13

___

### vibrato

• **vibrato**: `vibratoOptions`

#### Inherited from

[Filters](Filters.md).[vibrato](Filters.md#vibrato)

#### Defined in

src/Player/Filters.ts:167

___

### volume

• **volume**: `number`

#### Inherited from

[Filters](Filters.md).[volume](Filters.md#volume)

#### Defined in

src/Player/Filters.ts:163

## Methods

### clearFilters

▸ **clearFilters**(): [`Filters`](Filters.md)

#### Returns

[`Filters`](Filters.md)

The current filters applied to the currently playing track

#### Inherited from

[Filters](Filters.md).[clearFilters](Filters.md#clearfilters)

#### Defined in

src/Player/Filters.ts:315

___

### set8D

▸ **set8D**(`val`): `void`

Set 8D filter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `val` | `boolean` | Boolean |

#### Returns

`void`

#### Defined in

src/Player/CustomFilters.ts:100

___

### setBassboost

▸ **setBassboost**(`val`): `this`

Set the bassboost value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `val` | `number` | The value of the bassboost |

#### Returns

`this`

#### Defined in

src/Player/CustomFilters.ts:31

___

### setChannelMix

▸ **setChannelMix**(`mix`): [`Filters`](Filters.md)

Change the channel mix Options applied to the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mix` | [`channelMixOptions`](../interfaces/channelMixOptions.md) | An object that conforms to the ChannelMixOptions type that defines the channel mix to apply |

#### Returns

[`Filters`](Filters.md)

#### Inherited from

[Filters](Filters.md).[setChannelMix](Filters.md#setchannelmix)

#### Defined in

src/Player/Filters.ts:280

___

### setDistortion

▸ **setDistortion**(`distortion`): [`Filters`](Filters.md)

Change the distortion Options applied to the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `distortion` | `distortionOptions` | An object that conforms to the DistortionOptions type that defines the distortion to apply |

#### Returns

[`Filters`](Filters.md)

#### Inherited from

[Filters](Filters.md).[setDistortion](Filters.md#setdistortion)

#### Defined in

src/Player/Filters.ts:267

___

### setEqualizer

▸ **setEqualizer**(`bands`): [`Filters`](Filters.md)

Set equalizer bands for the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bands` | `Band`[] | An array of bands to set the equalizer to |

#### Returns

[`Filters`](Filters.md)

#### Inherited from

[Filters](Filters.md).[setEqualizer](Filters.md#setequalizer)

#### Defined in

src/Player/Filters.ts:194

___

### setFilters

▸ **setFilters**(`options`): [`customFilter`](customFilter.md)

Change the filters of the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `any` | An object that conforms to the FiltersOptions type that defines the filters to apply |

#### Returns

[`customFilter`](customFilter.md)

#### Inherited from

[Filters](Filters.md).[setFilters](Filters.md#setfilters)

#### Defined in

src/Player/Filters.ts:305

___

### setKaraoke

▸ **setKaraoke**(`karaoke?`): [`Filters`](Filters.md)

Change the karaoke Options applied to the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `karaoke?` | `karaokeOptions` | An object that conforms to the KaraokeOptions type that defines a range of frequencies to mute |

#### Returns

[`Filters`](Filters.md)

The current filter instance

#### Inherited from

[Filters](Filters.md).[setKaraoke](Filters.md#setkaraoke)

#### Defined in

src/Player/Filters.ts:207

___

### setLowPass

▸ **setLowPass**(`pass`): [`Filters`](Filters.md)

Change the low pass Options applied to the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pass` | `lowPassOptions` | An object that conforms to the LowPassOptions type that defines the low pass to apply |

#### Returns

[`Filters`](Filters.md)

#### Inherited from

[Filters](Filters.md).[setLowPass](Filters.md#setlowpass)

#### Defined in

src/Player/Filters.ts:293

___

### setNightcore

▸ **setNightcore**(`val`): `boolean`

Set Nightcore filter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `val` | `boolean` | Boolean |

#### Returns

`boolean`

#### Defined in

src/Player/CustomFilters.ts:70

___

### setRotation

▸ **setRotation**(`rotation?`): [`Filters`](Filters.md)

Change the rotation Options applied to the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rotation?` | `rotationOptions` | An object that conforms to the RotationOptions type that defines the rotation to apply |

#### Returns

[`Filters`](Filters.md)

#### Inherited from

[Filters](Filters.md).[setRotation](Filters.md#setrotation)

#### Defined in

src/Player/Filters.ts:254

___

### setSlowmode

▸ **setSlowmode**(`val`): `this`

Set slowmode filter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `val` | `boolean` | The value of the band |

#### Returns

`this`

#### Defined in

src/Player/CustomFilters.ts:48

___

### setTimescale

▸ **setTimescale**(`timescale?`): [`Filters`](Filters.md)

Change the timescale Options applied to the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `timescale?` | `timescaleOptions` | An object that conforms to the TimescaleOptions type that defines the timescale to apply |

#### Returns

[`Filters`](Filters.md)

The current filter instance

#### Inherited from

[Filters](Filters.md).[setTimescale](Filters.md#settimescale)

#### Defined in

src/Player/Filters.ts:219

___

### setTremolo

▸ **setTremolo**(`tremolo?`): [`Filters`](Filters.md)

Change the tremolo Options applied to the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tremolo?` | `tremoloOptions` | An object that conforms to the TremoloOptions type that defines the tremolo to apply |

#### Returns

[`Filters`](Filters.md)

#### Inherited from

[Filters](Filters.md).[setTremolo](Filters.md#settremolo)

#### Defined in

src/Player/Filters.ts:231

___

### setVaporwave

▸ **setVaporwave**(`val`): `void`

Set Vaporwave filter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `val` | `boolean` | Boolean |

#### Returns

`void`

#### Defined in

src/Player/CustomFilters.ts:86

___

### setVibrato

▸ **setVibrato**(`vibrato?`): [`Filters`](Filters.md)

Change the vibrato Options applied to the currently playing track

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vibrato?` | `vibratoOptions` | An object that conforms to the VibratoOptions type that defines the vibrato to apply |

#### Returns

[`Filters`](Filters.md)

#### Inherited from

[Filters](Filters.md).[setVibrato](Filters.md#setvibrato)

#### Defined in

src/Player/Filters.ts:243

___

### updateFilters

▸ **updateFilters**(): [`Filters`](Filters.md)

#### Returns

[`Filters`](Filters.md)

the updated filters applied to the currently playing track

#### Inherited from

[Filters](Filters.md).[updateFilters](Filters.md#updatefilters)

#### Defined in

src/Player/Filters.ts:325
