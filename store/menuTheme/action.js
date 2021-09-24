import * as actionType from './action-type';

export function changeMenuTheme(menuType){
    return {
        type: menuType,
        menuType
    }
}