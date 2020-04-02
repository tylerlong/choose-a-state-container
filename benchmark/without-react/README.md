## Latest Test Result

```
yarn bench
yarn run v1.22.4
$ node -r @babel/register benchmark/without-react/index.js
SubX adding todos x 791 ops/sec ±3.44% (78 runs sampled)
Redux adding todos x 42.17 ops/sec ±84.34% (7 runs sampled)
MobX adding todos x 16.52 ops/sec ±28.80% (16 runs sampled)
Fastest is SubX adding todos
SubX editing todos x 372 ops/sec ±0.82% (87 runs sampled)
Redux editing todos x 18.06 ops/sec ±5.95% (36 runs sampled)
MobX editing todos x 17.09 ops/sec ±1.37% (47 runs sampled)
Fastest is SubX editing todos
SubX deleting & re-adding todos x 123 ops/sec ±0.81% (79 runs sampled)
Redux deleting & re-adding todos x 4,829 ops/sec ±1.12% (96 runs sampled)
MobX deleting & re-adding todos x 446 ops/sec ±0.52% (91 runs sampled)
Fastest is Redux deleting & re-adding todos
✨  Done in 53.02s.
```


## Legacy Test Result

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
