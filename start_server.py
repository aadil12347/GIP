import http.server
import socketserver
import webbrowser
import threading
import time

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    # Enable CORS and custom headers if needed
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def open_browser():
    time.sleep(1) # Wait for server to start
    url = f"http://localhost:{PORT}"
    print(f"Launching default web browser at {url} ...")
    webbrowser.open(url)

def main():
    handler = MyHandler
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Server successfully started at port {PORT}")
        print("Press Ctrl+C in this terminal window to stop the server.")
        
        # Start browser in a background thread
        threading.Thread(target=open_browser, daemon=True).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Goodbye!")

if __name__ == '__main__':
    main()
