import { RequestQuery } from './RequestQuery';

const ANIMATED_ACTIONS = new Set([
    'wlk', 'mv',         // walk
    'wav', 'wave',       // wave
    'blow', 'cry', 'idle', 'laugh', 'respect', 'ridejump', 'sbollie', 'sb360', // expressions
    'talk', 'typing', 'blink',                                                   // misc animated
    'swdieback', 'swdiefront', 'swpick', 'swrun', 'swthrow',                    // snowwar
    'sixseven', '67',                                                           // 67 meme gesture
]);

export const GetImageFormatRequest = (query: RequestQuery) =>
{
    // explicit override always wins
    if(query.img_format === 'gif') return 'gif';
    if(query.img_format === 'png') return 'png';
    if(query.img_format === 'apng') return 'apng';
    if(query.img_format === 'webp') return 'webp';

    // Animated output defaults to WebP (full alpha, lossless, smaller, and
    // free of GIF's per-frame palette flicker). GIF's 1-bit transparency
    // mangles soft effect glows/shadows and shimmers anti-aliased edges.
    // Force &img_format=gif for maximum legacy-client compatibility.
    if(query.effect && parseInt(query.effect) > 0) return 'webp';

    if(query.dance) return 'webp';

    if(query.action)
    {
        const actions = query.action.split(',').map(a => a.split('=')[0].toLowerCase());

        if(actions.some(a => ANIMATED_ACTIONS.has(a))) return 'webp';
    }

    return 'png';
}
