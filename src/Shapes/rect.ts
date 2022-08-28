import type { CanvasEngine, RenderOptions } from '../canvasEngine'
import type { Position, RectShape } from '../types'
import { ShapeType } from '../types'
import { BaseShape } from './base'

export interface RectOptions {
  x: number
  y: number
  w: number
  h: number
  zIndex: number
}
// 这里需要对shapeInfo进行 副作用的处理 也就是做个proxy
export class Rect extends BaseShape<RectShape, RectOptions> {
  shapeInfo = {} as RectShape
  id = Symbol('Rect')
  constructor(x: number, y: number, w: number, h: number, zIndex: number)
  constructor(options: RectOptions)
  constructor(
    options: RectOptions | number,
    y?: number,
    w?: number,
    h?: number,
    zIndex?: number,
  ) {
    super()
    const completeConfiguration = this.generateConfiguration(
      options,
      y,
      w,
      h,
      zIndex,
    )
    // 这里给shapeInfo 注入信息
    this.injectShapeInfo(completeConfiguration)
    this.machiningGraphics(completeConfiguration)
  }

  generateConfiguration(
    options: RectOptions | number,
    y?: number,
    w?: number,
    h?: number,
    zIndex?: number,
  ) {
    let completeConfiguration: RectOptions
    if (typeof options === 'object') {
      completeConfiguration = options
    }
    else {
      completeConfiguration = {
        x: options,
        y: y!,
        w: w!,
        h: h!,
        zIndex: zIndex!,
      }
    }
    return completeConfiguration
  }

  // 这里相当于是去画那个图形
  protected machiningGraphics(options: RectOptions) {
    const { x, y, w, h } = options
    this.path2D.rect(x, y, w, h)
  }

  public newFun(options: RectOptions) {
    const path2D = new Path2D()
    const { x, y, w, h } = options
    path2D.rect(x, y, w, h)
    this.path2D = path2D
  }

  protected injectShapeInfo(info: RectOptions) {
    const { x, y, w, h, zIndex } = info
    const topCenter: Position = { x: (x + w) / 2, y }
    const bottomCenter: Position = { x: (x + w) / 2, y: y + h }
    const leftCenter: Position = { x, y: (y + h) / 2 }
    const rightCenter: Position = { x: x + w, y: (y + h) / 2 }
    this.shapeInfo = {
      ...info,
      shape: ShapeType.Rect,
      topCenter,
      bottomCenter,
      leftCenter,
      rightCenter,
    }

    this.zIndex = zIndex
  }

  // 这里渲染
  render(canvasEngine: CanvasEngine, options: RenderOptions) {
    const {
      options: { color },
      cb,
    } = options
    canvasEngine.ctx.fillStyle = color || ''
    canvasEngine.ctx.fill(this.path2D)
    cb()
  }

  // 提供一个修改参数的方法 然后让他重新去渲染
  setOption(canvasEngine: CanvasEngine, options: RectOptions) {
    // 我们的目的是修改了this.path2D就行
    const completeConfiguration = this.generateConfiguration(
      options,
    )
    // 这里给shapeInfo 注入信息
    this.injectShapeInfo(completeConfiguration)
    this.newFun(completeConfiguration)
    // 然后重新调用下renderTask就做到了清除的作用
    canvasEngine.reload()
  }
}
