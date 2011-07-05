from flup.server.fcgi import WSGIServer
import main

if __name__ == '__main__':
    WSGIServer(main.app).run()

