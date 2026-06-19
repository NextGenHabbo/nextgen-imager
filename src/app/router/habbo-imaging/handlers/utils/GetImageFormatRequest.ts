import { RequestQuery } from './RequestQuery';

const ANIMATED_ACTIONS = new Set([
    'wlk', 'mv',         // walk
    'wav', 'wave',       // wave
    'blow', 'cry', 'idle', 'laugh', 'respect', 'ridejump', 'sbollie', 'sb360', // expressions
    'talk', 'typing', 'blink',                                                   // misc animated
    'swdieback', 'swdiefront', 'swpick', 'swrun', 'swthrow',                    // snowwar
]);

export const GetImageFormatRequest = (query: RequestQuery) =>
{
    if(query.img_format === 'gif') return 'gif';
    if(query.img_format === 'png') return 'png';

    if(query.dance) return 'gif';

    if(query.action)
    {
        const actions = query.action.split(',').map(a => a.split('=')[0].toLowerCase());

        if(actions.some(a => ANIMATED_ACTIONS.has(a))) return 'gif';
    }

    return 'png';
}
