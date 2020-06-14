import {cameraReleatedHook, locationReleatedHook, audioReleatedHook, life_cycle_hook, permission_request_hook} from './scenario'

Java.perform(function() {
	if(Java.available) {
		console.log('[+] JVM load success');
    locationReleatedHook(false);
    // cameraReleatedHook(true);
    // audioReleatedHook(false);
    life_cycle_hook(false);
    permission_request_hook(false);
	}
})