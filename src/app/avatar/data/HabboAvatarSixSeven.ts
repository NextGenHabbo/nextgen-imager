import { IAssetAnimation } from '../../../core';

// Ported from habbo-client-cc dance_sixseven_animation.bin ("67 meme gesture").
// Reuses existing sprites: arms in CarryItem state, head in Talk state, with
// per-frame offsets. No new artwork required.
export const HabboAvatarSixSeven: { [index: string]: IAssetAnimation } = {
    'dance.sixseven': {
        name: 'dance.sixseven',
        desc: '67 meme gesture',
        frames: [
            { bodyparts: [ { id: 'leftarm', action: 'Default', frame: 0, dx: -1, dy: 1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'Default', frame: 0, dx: 1, dy: 1, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 1, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: -1, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: -1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 1, dx: 0, dy: 0, dd: 1 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 1, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 0, dx: 0, dy: 0, dd: 1 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 1, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: -1, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: -1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Talk', frame: 1, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 1, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'CarryItem', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'CarryItem', frame: 0, dx: 1, dy: -1, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'Default', frame: 0, dx: -1, dy: 1, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 1, dd: 0 }, { id: 'rightarm', action: 'Default', frame: 1, dx: 1, dy: 1, dd: 0 } ] },
            { bodyparts: [ { id: 'leftarm', action: 'Default', frame: 0, dx: -1, dy: 0, dd: 0 }, { id: 'torso', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'head', action: 'Default', frame: 0, dx: 0, dy: 0, dd: 0 }, { id: 'rightarm', action: 'Default', frame: 0, dx: 1, dy: 0, dd: 0 } ] },
        ],
    },
};
