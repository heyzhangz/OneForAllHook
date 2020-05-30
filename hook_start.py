import frida, sys
import json
import IPython
import time
import os
import signal

api_log = []
package_name = ''

def formatStackInfo(message):
    stackInfo = message['stack']
    infos = stackInfo.split('\n    ')
    message['stack'] = infos
    
    
def printError(message):
    formatStackInfo(message)
    print(json.dumps(message, indent=4))

def save_message(package_name, message):
    path = os.path.join('log', package_name + '.json')
    if not os.path.exists(path):
        with open(path, 'w') as f:
            f.write(message + '\n')
    else:
        with open(path, 'a+') as f:
            f.write(message + '\n')
    # if os.path.exists(path):
    #     with open(path) as f:
    #         log = json.load(f)
    # else:
    #     log = []
    # trace = json.loads(message)
    # log.append(trace)
    # with open(path, 'w') as f:
    #     json.dump(log, f, indent=4)
def on_message(message, data):
    if message['type'] == 'send':
        save_message(package_name, message['payload'])
        # print("[*] {0}".format(message['payload']))
    else:
        printError(message)
        

def quit(signum, frame):
    print('stop ...')
    os._exit(0)

if __name__ == "__main__":
    try:
        signal.signal(signal.SIGINT, quit)
        signal.signal(signal.SIGTERM, quit)
        package_name = sys.argv[1]
        # 加载Frida
        with open ('_agent.js') as f:
            jscode = f.read()

        process = frida.get_usb_device().attach(package_name)
        script = process.create_script(jscode)
        script.on('message', on_message)
        print('[*] Running App')
        script.load()

        sys.stdin.read()
    except Exception as e:
        print(e.args)