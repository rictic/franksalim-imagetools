import gc
import torch

device = "cuda"

class DummySafetyChecker():
    def __init__(self, *args, **kwargs):
        # required monkeypatching to prevent an error splitting the module name to check type
        self.__module__ = "foo.bar.foo.bar"

    def __call__(self, images, **kwargs):
        return (images, False)
        
def torch_gc():
    gc.collect()
    # try to get my vram back :/
    torch.cuda.empty_cache()
    torch.cuda.ipc_collect()
    gc.collect()
