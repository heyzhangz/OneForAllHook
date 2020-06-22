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
    let google_target_class = 'com.google.android.gms.ads.AdRequest$Builder'
    h.get_class_method_names(google_target_class).forEach((method) => {
        h.hook_target_method(google_target_class, method, 'android.location.Location', '', true, false)
    })

    // facebook 没找到地理位置接口
    // let fb_target_class = ''

    let mopub_target_class = 'com.mopub.common.AdUrlGenerator'
    let methods = h.get_class_method_names(mopub_target_class)
    methods.forEach((method) => {
        h.hook_target_method(mopub_target_class, method, 'android.location.Location', 'void', true, false)
    })

    let amazon_target_class = 'com.amazon.device.ads.AdLocation'
    h.get_class_method_names(amazon_target_class).forEach((method) => {
        h.hook_target_method(amazon_target_class, method, '', 'android.location.Location', true, false)
    })

    // flurry本身sdk就已经混淆了
    // let flurry_target_class = ''

    let inmobi_target_class = 'com.inmobi.sdk.InMobiSdk'
    h.get_class_method_names(inmobi_target_class).forEach((method) => {
        h.hook_target_method(inmobi_target_class, method, 'android.location.Location', '', true, false)
        //setLocationWithCityStateCountry
        h.hook_target_method(inmobi_target_class, method, 'java.lang.String,java.lang.String,java.lang.String', '', true, false)
    })

    let adcolony_target_class = 'com.adcolony.sdk'
    h.get_class_method_names(adcolony_target_class).forEach((method) => {
        h.hook_target_method(adcolony_target_class, method, 'android.location.Location', '', true, false)
    })

    // appLovin sdk类名混淆，并且本身用的好像是WebSettings的setGeolocationEnabled
    // let appLovin_target_class = ''
}

export function test_func() {
    h.hook_target_method('android.location.Location', 'distanceBetween', '', '', true, true);
}
