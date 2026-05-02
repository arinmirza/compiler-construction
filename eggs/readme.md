## Usage

Navigate to the directory of interest.

- `eggs/regex/` scannar implementation
- `eggs/cfg/` context-free grammars

Then run:

```bash
egglog base.egg analyses/*.egg tests/*.egg
```
- `base.egg` is the base declaration file of sorts.
- Includes all analyses under `analyses/`
- Executes all tests under `tests/`