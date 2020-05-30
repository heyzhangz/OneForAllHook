import {cameraReleatedHook, locationReleatedHook, audioReleatedHook} from './scenario'

Java.perform(function() {
	if(Java.available) {
		console.log('[+] JVM load success');
    locationReleatedHook();
    cameraReleatedHook();
    audioReleatedHook();
	}
})