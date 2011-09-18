import os
import code

from flaskext.script import Manager, Server, Shell, Command

from app.main import app

manager = Manager(app)

class DevServer(Server):
    description = "Run the local dev server"
    def handle(self, *args, **kwargs):
        super(DevServer, self).handle(*args, **kwargs)

class IShell(Shell):
    def run(self, no_ipython):
        """
        Runs the shell. Unless no_ipython is True or use_python is False
        then runs IPython shell if that is installed.
        """

        context = self.get_context()
        if not no_ipython:
            from IPython.frontend.terminal.embed import InteractiveShellEmbed
            sh = InteractiveShellEmbed(banner2=self.banner)
            sh(global_ns=dict(), local_ns=context)
            return

        code.interact(self.banner, local=context)

dev_server = DevServer(host='0.0.0.0', port=5001, use_debugger=True, use_reloader=True)
manager.add_command('rundev', dev_server)
manager.add_command('shell', IShell())

if __name__ == "__main__":
    manager.run()
