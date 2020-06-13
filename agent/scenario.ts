import { hooking as h } from './hook';

export function cameraReleatedHook(trace_flag: boolean) {
    let target_classes:string[];
    target_classes = [
      'android.hardware.Camera', 
      'android.hardware.camera2.CameraManager', 
      'android.hardware.camera2.CaptureResult', 
      'android.hardware.camera2.CaptureRequest',
      'android.hardware.camera2.impl.CameraDeviceImpl'
    ]
    target_classes.forEach((clazz) => {
      h.hook_class_methods(clazz, trace_flag);
    });
}

export function locationReleatedHook(trace_flag: boolean) {
    let target_classes:string[];
    target_classes = [
      'android.location.ILocationManager',
      'android.location.ILocationManager$Stub',
      'android.location.ILocationManager$Stub$Proxy',
      'android.location.LocationManager',
      'android.location.LocationManager$GnssStatusListenerTransport$1',
      'android.location.LocationManager$GnssStatusListenerTransport$2',
      'android.location.LocationManager$GnssStatusListenerTransport$Nmea',
      'android.location.LocationManager$ListenerTransport',
      'android.location.LocationManager$ListenerTransport$1',
      'android.location.LocationManager$ListenerTransport$2'
    ]
    target_classes.forEach((clazz) => {
      h.hook_class_methods(clazz, trace_flag);
    })
}

export function audioReleatedHook(trace_flag: boolean) {
    let target_classes:string[];
    target_classes = [
      'android.media.MediaPlayer', 
      'android.media.AudioTrack',
      'android.media.PlayerBase',
      'android.speech.tts.TextToSpeech'
    ]
    target_classes.forEach((clazz) => {
      h.hook_class_methods(clazz, trace_flag);
    })
}


export function life_cycle_hook(trace_flag: boolean) {
  let target_classes:string[];
  target_classes = [
    'android.app.Activity',
    'android.app.Service'
  ]
  target_classes.forEach((clazz) => {
    h.hook_target_methods(clazz, 'onCreate', trace_flag, false);
    // h.hook_class_methods(clazz, false);
  })
}

export function permission_request_hook(trace_flag: boolean) {
  h.hook_target_methods('android.app.Activity', 'requestPermissions', trace_flag, true);
  h.hook_target_methods('android.app.Fragment', 'requestPermissions', trace_flag, true);
}