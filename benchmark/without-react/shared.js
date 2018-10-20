import { autorun } from 'mobx'

import subxStore from '../todomvc/subx'
import reduxStore, { setTodos } from '../todomvc/redux'
import mobxStore from '../todomvc/mobx'

// why autorun?
// Because we want to benchamark with cache
// Ref: https://github.com/mobxjs/mobx/issues/1093
// SubX & Redux both have cache enabled, it's unfair for them if we don't turn on cache for MobX
// More test case about cache please check the "cache" folder of this project
autorun(() => mobxStore.visibleTodos)
autorun(() => mobxStore.length)
autorun(() => mobxStore.areAllDone)
autorun(() => mobxStore.leftCount)
autorun(() => mobxStore.doneCount)

export const resetStores = () => {
  subxStore.todos = []
  reduxStore.dispatch(setTodos([]))
  mobxStore.todos = []
}
