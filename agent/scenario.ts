import { hooking as h } from './hook';

export function cameraReleatedHook() {
    let target_classes:string[];
    target_classes = [
      'android.hardware.Camera', 
      'android.hardware.camera2.CameraManager', 
      'android.hardware.camera2.CaptureResult', 
      'android.hardware.camera2.CaptureRequest',
      'android.hardware.camera2.CameraCaptureSession'
    ]
    target_classes.forEach((clazz) => {
      h.hook_class_methods(clazz);
    });
}

export function locationReleatedHook() {
    let target_classes:string[];
    target_classes = [
      'android.location.LocationManager', 
      'android.telephony.TelephonyManager'
    ]
    target_classes.forEach((clazz) => {
      h.hook_class_methods(clazz);
    })
}

export function audioReleatedHook() {
    let target_classes:string[];
    target_classes = [
      'android.media.MediaPlayer', 
      'android.media.AudioTrack',
      'android.media.PlayerBase'
    ]
    target_classes.forEach((clazz) => {
      h.hook_class_methods(clazz);
    })
}