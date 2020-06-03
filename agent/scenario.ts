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
      'android.location.LocationManager', 
      'android.telephony.TelephonyManager',
      'android.location.LocationManager$GnssStatusListenerTransport$1',
      'android.location.LocationManager$GnssStatusListenerTransport$GnssHandler'
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
    h.hook_target_methods(clazz, 'onCreate', trace_flag);
    // h.hook_class_methods(clazz, false);
  })
}