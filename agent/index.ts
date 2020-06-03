import {cameraReleatedHook, locationReleatedHook, audioReleatedHook, life_cycle_hook} from './scenario'

Java.perform(function() {
	if(Java.available) {
		console.log('[+] JVM load success');
    // locationReleatedHook(true);
    cameraReleatedHook(false);
    audioReleatedHook(false);
    life_cycle_hook(false);
	}
})