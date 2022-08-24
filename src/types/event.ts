import type { ShapeClassType } from './shape'

// 这里需要加几个事件名字 就是移动之类的
export enum EventName {
  click = 'click',
  dblclick = 'dblclick',
  mousedown = 'mousedown',
  mouseup = 'mouseup',
  mousemove = 'mousemove',
}

export type ValidEventType = MouseEvent

export type EventFn = (event: ValidEventType) => unknown

export type Noop = () => {}

export type EventHandlerFn = (e: ValidEventType, shape: ShapeClassType) => void
export type NormalEventHandlerFn = (ev: MouseEvent) => any
