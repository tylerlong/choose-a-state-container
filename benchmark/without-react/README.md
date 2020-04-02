# Test result

```
yarn bench
yarn run v1.22.4
$ node -r @babel/register benchmark/without-react/index.js
Browserslist: caniuse-lite is outdated. Please run next command `yarn upgrade caniuse-lite browserslist`
SubX adding todos x 942 ops/sec ±5.78% (77 runs sampled)
Redux adding todos x 42.31 ops/sec ±47.63% (11 runs sampled)
MobX adding todos x 15.35 ops/sec ±28.73% (16 runs sampled)
Fastest is SubX adding todos
SubX editing todos x 357 ops/sec ±1.34% (79 runs sampled)
Redux editing todos x 22.22 ops/sec ±1.14% (41 runs sampled)
MobX editing todos x 15.39 ops/sec ±1.34% (42 runs sampled)
Fastest is SubX editing todos
SubX deleting & re-adding todos x 165 ops/sec ±3.51% (84 runs sampled)
Redux deleting & re-adding todos x 4,940 ops/sec ±0.58% (95 runs sampled)
MobX deleting & re-adding todos x 333 ops/sec ±1.70% (88 runs sampled)
Fastest is Redux deleting & re-adding todos
✨  Done in 52.82s.
```
