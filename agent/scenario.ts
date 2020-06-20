import { hooking as h } from './hook';


export function cameraReleatedHook(trace_flag: boolean, arg_vals: boolean) {
    let target_classes:string[];
    target_classes = [
      'android.hardware.Camera', 
      'android.hardware.camera2.CameraManager', 
      'android.hardware.camera2.CaptureResult', 
      'android.hardware.camera2.CaptureRequest',
      'android.hardware.camera2.impl.CameraDeviceImpl'
    ]
    target_classes.forEach((clazz) => {
      h.hook_class_methods(clazz, trace_flag, arg_vals);
    });
}

export function locationReleatedHook(trace_flag: boolean, arg_vals: boolean) {
    let target_classes:string[];
    target_classes = [
      "android.location.GpsStatus$SatelliteIterator",
      "android.location.IGnssStatusListener$Stub",
      "android.location.GpsStatus$SatelliteIterator",
      "android.location.LocationManager$GnssStatusListenerTransport$GnssHandler",
      "android.location.LocationManager$GnssStatusListenerTransport",
      "android.location.GpsSatellite",
      "android.location.LocationManager",
      "android.location.GpsStatus",
      "android.location.GpsStatus$1",
      "android.location.Location"
    ]
    target_classes.forEach((clazz) => {
      h.hook_class_methods(clazz, trace_flag, arg_vals);
    })
}

export function audioReleatedHook(trace_flag: boolean, arg_vals: boolean) {
    let target_classes:string[];
    target_classes = [
      'android.media.MediaPlayer', 
      'android.media.AudioTrack',
      'android.media.PlayerBase',
      'android.speech.tts.TextToSpeech'
    ]
    target_classes.forEach((clazz) => {
      h.hook_class_methods(clazz, trace_flag, arg_vals);
    })
}


export function life_cycle_hook(trace_flag: boolean, arg_vals: boolean) {
  let target_classes:string[];
  target_classes = [
    'android.app.Activity',
    'android.app.Service'
  ]
  target_classes.forEach((clazz) => {
    h.hook_target_method(clazz, 'onCreate', '', '', trace_flag, arg_vals);
  })
}

export function permission_request_hook(trace_flag: boolean, arg_vals: boolean) {
  h.hook_target_method('android.app.Activity', 'requestPermissions', '', '', trace_flag, arg_vals);
  h.hook_target_method('android.app.Fragment', 'requestPermissions', '', '', trace_flag, arg_vals);
}

export function ad_hook() {
    let arg_target_classes = [
        'com.google.android.gms.ads.AdRequest$Builder',
        'com.mopub.common.AdUrlGenerator'
    ]
    arg_target_classes.forEach((clazz) => {
        let methods = h.get_class_method_names(clazz);
        methods.forEach(m => {
            h.hook_target_method(clazz, m, 'android.location.Location', '', true, false);
        })
    })

    let ret_target_classes = [
        'com.amazon.device.ads.AdLocation'
    ]
    ret_target_classes.forEach((clazz) => {
        let methods = h.get_class_method_names(clazz);
        methods.forEach(m => {
            h.hook_target_method(clazz, m, '', 'android.location.Location', true, false);
        })
    })
}

export function test_func() {
    h.hook_target_method('android.location.Location', 'distanceBetween', '', '', true, true);
}
