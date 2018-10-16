## Interesting facts

- Must decorate `todo.cache` with `observable`, otherwise you cannot edit a newly added todo item.
- `todo.cache = undefined` cannot be replaced with `delete todo.cache`, otherwise `doneEdit` doesn't work.
- for saving to localStorage, I want to debounce(1000), but there is no easy way to let MobX supports `debounce`
    - `delay` option for `autorun` is `throttle` instead of `debounce`.
