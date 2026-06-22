import { AvatarAction, IAvatarImage } from '../../../../../avatar';

// Custom "67 meme" gesture. Routes &action=sixseven (or 67) to the
// dance.sixseven animation registered at startup.
export const ProcessSixSevenAction = (action: string, avatar: IAvatarImage) =>
{
    let didSet = false;

    if(action && action.length)
    {
        const [ key ] = action.split('=');

        switch(key)
        {
            case '67':
            case 'sixseven':
                didSet = true;
                avatar.appendAction(AvatarAction.DANCE, 'sixseven');
                break;
        }
    }

    return didSet;
}
