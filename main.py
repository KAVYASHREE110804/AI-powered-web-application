"""DemoLens pipeline entry point."""

import importlib
import pkgutil

import modules


def load_all_modules() -> list[str]:
    """Import every submodule of `modules` to verify they load correctly."""
    loaded = []
    for info in pkgutil.iter_modules(modules.__path__, prefix="modules."):
        importlib.import_module(info.name)
        loaded.append(info.name)
    return loaded


def main() -> None:
    loaded = load_all_modules()
    print("DemoLens pipeline ready")
    if loaded:
        print(f"Loaded modules: {', '.join(loaded)}")


if __name__ == "__main__":
    main()
