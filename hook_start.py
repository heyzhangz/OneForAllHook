import frida, sys
import json
import IPython
import time
import os
import signal

api_log = []
package_name = ''
class_set = set()


def formatStackInfo(message):
    stackInfo = message['stack']
    infos = stackInfo.split('\n    ')
    message['stack'] = infos

def get_caller_class(call_stack, depth):
    stacks = call_stack.split('\n')
    depth = min(len(stacks), depth)
    for i in range(depth):
        caller_class = stacks[i].replace('\t', '')
        if caller_class.startswith('android.'):
            tmp = caller_class[:caller_class.find('(')]
            method = tmp.split('.')[-1]
            caller_class = tmp.replace(method, '')[:-1]
            class_set.add(caller_class)
        else:
            print('[+] ' + caller_class)
    return class_set

    
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
        report = json.loads(message['payload'])
        if 'backtrace' in report.keys():
            class_set = get_caller_class(report['backtrace'], 5)
            print(class_set)
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