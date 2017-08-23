class Plugin1:
    def setPlatform(self, platform):
        self.platform=platform

    def start(self):
        self.platform.sayHello("plugin1")