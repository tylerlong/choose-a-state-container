## Interesting facts

- Must decorate `todo.cache` with `observable`, otherwise you cannot edit a newly added todo item.
- `todo.cache = undefined` cannot be replaced with `delete todo.cache`, otherwise `doneEdit` doesn't work.
