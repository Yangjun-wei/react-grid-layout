// @flow

import { cloneLayout, compact, correctBounds } from "./utils";

import type { CompactType, Layout } from "./utils";

export type Breakpoint = string;
export type DefaultBreakpoints = "lg" | "md" | "sm" | "xs" | "xxs";

// + indicates read-only
// 对象，key是Breakpoint，值是Layout
export type ResponsiveLayout<T: Breakpoint> = {
  +[breakpoint: T]: Layout
};
// 对象，key是Breakpoint，值是number
export type Breakpoints<T: Breakpoint> = {
  +[breakpoint: T]: number
};

export type OnLayoutChangeCallback = (
  Layout,
  { [key: Breakpoint]: Layout }
) => void;

/**
 * Given a width, find the highest breakpoint that matches is valid for it (width > breakpoint).
 *
 * @param  {Object} breakpoints Breakpoints object (e.g. {lg: 1200, md: 960, ...})
 * @param  {Number} width Screen width.
 * @return {String}       Highest breakpoint that is less than width.
 */
// 从所有breakPoints中找出不大于width的breakPoints中的那一个最大的,返回breakPoints的名字
export function getBreakpointFromWidth(
  // Breakpoint就是string类型
  breakpoints: Breakpoints<Breakpoint>,
  width: number
): Breakpoint {
  // 获取对象的key数组，按照value从小到大排序,
  const sorted = sortBreakpoints(breakpoints);
  let matching = sorted[0];
  for (let i = 1, len = sorted.length; i < len; i++) {
    const breakpointName = sorted[i];
    if (width > breakpoints[breakpointName]) matching = breakpointName;
  }
  return matching;
}

/**
 * Given a breakpoint, get the # of cols set for it.
 * @param  {String} breakpoint Breakpoint name.
 * @param  {Object} cols       Map of breakpoints to cols.
 * @return {Number}            Number of cols.
 */
export function getColsFromBreakpoint(
  breakpoint: Breakpoint,
  cols: Breakpoints<Breakpoint>
): number {
  if (!cols[breakpoint]) {
    throw new Error(
      "ResponsiveReactGridLayout: `cols` entry for breakpoint " +
        breakpoint +
        " is missing!"
    );
  }
  return cols[breakpoint];
}

/**
 * Given existing layouts and a new breakpoint, find or generate a new layout.
 *
 * This finds the layout above the new one and generates from it, if it exists.
 *
 * @param  {Object} layouts     Existing layouts.
 * @param  {Array} breakpoints All breakpoints.
 * @param  {String} breakpoint New breakpoint.
 * @param  {String} breakpoint Last breakpoint (for fallback).
 * @param  {Number} cols       Column count at new breakpoint.
 * @param  {Boolean} verticalCompact Whether or not to compact the layout
 *   vertically.
 *   找到或生成一个layout
 * @return {Array}             New layout.
 */
export function findOrGenerateResponsiveLayout(
  // 对象，key是Breakpoint，值是Layout
  layouts: ResponsiveLayout<Breakpoint>,
  // 对象，key是Breakpoint，值是number
  breakpoints: Breakpoints<Breakpoint>,
  // 字符串
  breakpoint: Breakpoint,
  lastBreakpoint: Breakpoint,
  cols: number,
  // 枚举，水平或垂直
  compactType: CompactType
): Layout {
  // If it already exists, just return it.
  // 如果breakPoint对应的layout存在，那就是直接复制返回
  if (layouts[breakpoint]) return cloneLayout(layouts[breakpoint]);
  // Find or generate the next layout
  let layout = layouts[lastBreakpoint];
  // 根据value从小到大排序breakpoints名字数组
  const breakpointsSorted = sortBreakpoints(breakpoints);
  // 把value比breakpoint对应的value都大或相等的breakpoint以数组形式返回
  const breakpointsAbove = breakpointsSorted.slice(
    breakpointsSorted.indexOf(breakpoint)
  );
  // 查找layout
  for (let i = 0, len = breakpointsAbove.length; i < len; i++) {
    const b = breakpointsAbove[i];
    if (layouts[b]) {
      layout = layouts[b];
      break;
    }
  }
  // 深度克隆找到的layout
  layout = cloneLayout(layout || []); // clone layout so we don't modify existing items
  return compact(correctBounds(layout, { cols: cols }), compactType, cols);
}

/**
 * Given breakpoints, return an array of breakpoints sorted by width. This is usually
 * e.g. ['xxs', 'xs', 'sm', ...]
 *
 * @param  {Object} breakpoints Key/value pair of breakpoint names to widths.
 * @return {Array}              Sorted breakpoints.
 */
// 从小到大排序
export function sortBreakpoints(
  breakpoints: Breakpoints<Breakpoint>
): Array<Breakpoint> {
  const keys: Array<string> = Object.keys(breakpoints);
  return keys.sort(function (a, b) {
    return breakpoints[a] - breakpoints[b];
  });
}
