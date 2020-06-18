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

// export function google_ad_hook() {
//   let target_class = 'com.google.android.gms.ads.AdRequest$Builder';
//   let methods = h.get_class_methods(target_class);
//   console.log(methods);
//   methods.forEach(m => {
//     if (m.endsWith('(android.location.Location)')) {
//       h.hook_target_methods(target_class, m.replace('(android.location.Location)', ''), false, false);
//     }
//   })
// }

export function ad_hook() {
    let arg_target_classes = [
        'com.google.android.gms.ads.AdRequest$Builder',
        'com.mopub.common.AdUrlGenerator'
    ]
    arg_target_classes.forEach((clazz) => {
        let methods = h.get_class_methods(clazz, false);
        methods.forEach(m => {
            if (m.endsWith('(android.location.Location)')) {
                h.hook_target_methods(clazz, m.replace('(android.location.Location)', ''), false, false, ['android.location.Location']);
            }
        })
    })

    let ret_target_classes = [
        'com.amazon.device.ads.AdLocation'
    ]
    ret_target_classes.forEach((clazz) => {
        let methods = h.get_class_methods(clazz, true);
        methods.forEach(m => {
            let splits = m.split(" ")
            let method = splits[1]
            let ret_arg = splits[0]
            if (ret_arg == 'android.location.Location') {
                h.hook_target_methods(clazz, method.split("(")[0], false, false);
            }
        })
    })
}
