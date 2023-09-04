import React from 'react';
import { FaXmark, FaWheelchairMove, FaTriangleExclamation, FaExclamation, FaBan, FaQuestion } from 'react-icons/fa6';
import { PiMagnifyingGlassBold, PiXBold, PiPlusCircleFill, PiArrowSquareOut, PiSmileySad, PiArrowLineRightFill, PiArrowLineUpFill, PiArrowLineDownFill, PiElevatorFill, PiEscalatorUpFill, PiChairFill, PiMonitorBold, PiFlameFill, PiCaretDown, PiDotsThreeBold, PiTrashSimpleFill, PiSignInBold, PiNavigationArrowBold, PiPathBold, PiPencilSimpleFill, PiHeartFill, PiBookOpenFill, PiCircleNotchBold } from 'react-icons/pi';
import { ReactComponent as IconRampEntrance } from '@assets/images/icon-ramp-entrance.svg';
import { ReactComponent as IconShelter } from '@assets/images/icon-shelter.svg';
import { ReactComponent as IconMenu } from '@assets/images/icon-menu.svg';
import { ReactComponent as IconUser } from '@assets/images/icon-user.svg';

export const Icon = props => {
    const { name, alt } = props;
    
    const altClass = alt ? " icon-alt" : "";
    
    const primaryIcons = {
        search: PiMagnifyingGlassBold,
        close: PiXBold,
        add: PiPlusCircleFill,
        link: PiArrowSquareOut,
        error: PiSmileySad,
        accessible: FaWheelchairMove,
        warning: FaTriangleExclamation,
        inaccessible: FaBan,
        unknown: FaQuestion,
        'at-grade': PiArrowLineRightFill,
        'above-grade': PiArrowLineUpFill,
        'below-grade': PiArrowLineDownFill,
        elevator: PiElevatorFill,
        escalator: PiEscalatorUpFill,
        'ramp-entrance': IconRampEntrance,
        bench: PiChairFill,
        shelter: IconShelter,
        display: PiMonitorBold,
        heating: PiFlameFill,
        chevron: PiCaretDown,
        ellipsis: PiDotsThreeBold,
        trash: PiTrashSimpleFill,
        user: IconUser,
        login: PiSignInBold,
        menu: IconMenu,
        location: PiNavigationArrowBold,
        route: PiPathBold,
        pencil: PiPencilSimpleFill,
        donation: PiHeartFill,
        book: PiBookOpenFill,
        spinner: PiCircleNotchBold
    };
    
    const altIcons = {
        accessible: primaryIcons.accessible,
        warning: FaExclamation,
        inaccessible: FaXmark,
        unknown: primaryIcons.unknown,
    };
    
    const IconChild = !alt ? primaryIcons[name] : altIcons[name];
    
    return (
        <span
            className={ "icon icon-" + name + altClass }
            aria-hidden="true"
        >
            <IconChild />
        </span>
    );
};