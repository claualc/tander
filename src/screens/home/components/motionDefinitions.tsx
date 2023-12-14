import { Dimensions } from "react-native";

// percentages of the movement of the card
export const MAX_SCROLL_UP = 0.18; // vertical
const MIN_SCROLL_UP = 0.075; // vertical
const IS_SWIPE_MOVE = 0.50; // horizontal move
const SCROLL_MOVE_MAX_DX = 0.099; // horizontal move

interface gesture { dx: number; dy: number, x0: number; y0: number }

const isTap = (ges : gesture) => (
    ges.dx == 0 && ges.dy == 0);

export const isLeftTap = (ges : gesture) => (
    isTap(ges) && ges.x0 < 170
)

export const isRightTap = (ges : gesture) => (
    isTap(ges) && ges.x0 > 200
)

const isSwipeMove = (ges: gesture) => (
    Math.abs(ges.dx/Dimensions.get('window').width) > IS_SWIPE_MOVE
);

export const isSwipeRight = (ges : gesture) => (
    isSwipeMove(ges) && ges.dx > 0
)

export const isSwipeLeft = (ges : gesture) => (
    isSwipeMove(ges) && ges.dx < 0
)

export const isScroll = (ges : gesture) => {
    // scroll up is negative
    let scrollUp = ges.dy / Dimensions.get('window').height;
    let horizontalDx = ges.dx / Dimensions.get('window').width;
    if (scrollUp < 0 ) {
        scrollUp = Math.abs(scrollUp);
        console.log(Math.abs(ges.dx) <= SCROLL_MOVE_MAX_DX,scrollUp >= MIN_SCROLL_UP)
        return Math.abs(horizontalDx) <= SCROLL_MOVE_MAX_DX && scrollUp >= MIN_SCROLL_UP
    }

    return false
}