import { AvatarDirectionAngle, AvatarSetType, IAvatarImage } from '../../../../../avatar';
import { GetDirectionRequest } from '../GetDirectionRequest';
import { GetHeadDirectionRequest } from '../GetHeadDirectionRequest';
import { RequestQuery } from '../RequestQuery';

export const ProcessDirectionRequest = (query: RequestQuery, avatar: IAvatarImage) =>
{
    const direction = (GetDirectionRequest(query) || 2);
    let headDirection = (GetHeadDirectionRequest(query) || direction);

    // habbo-imaging flips the head whenever the body is flipped (dir 4/5/6).
    // a non-flipped head direction (0,1,2) must be mapped to its flipped twin
    // (6,5,4) so it renders mirrored to match the official imager.
    const bodyFlipped = AvatarDirectionAngle.DIRECTION_IS_FLIPPED[direction] || false;
    const headFlipped = AvatarDirectionAngle.DIRECTION_IS_FLIPPED[headDirection] || false;

    if(bodyFlipped && !headFlipped && (headDirection >= 0) && (headDirection <= 2))
    {
        headDirection = (6 - headDirection);
    }

    avatar.setDirection(AvatarSetType.FULL, direction);
    avatar.setDirection(AvatarSetType.HEAD, headDirection);
}
