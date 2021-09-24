export const actionTypes = {
  CONTROL_COLLAPSED_CLOSE: 'GLOBAL_CONTROL_COLLAPSED_CLOSE',
  CONTROL_COLLAPSED_OPEN: 'GLOBAL_CONTROL_COLLAPSED_OPNE'
}

export function collapsedClose () {
  return { type: actionTypes.CONTROL_COLLAPSED_CLOSE }
}

export function collapsedOpen () {
  return { type: actionTypes.CONTROL_COLLAPSED_OPEN }
}
