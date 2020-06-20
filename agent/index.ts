import {cameraReleatedHook, locationReleatedHook, audioReleatedHook, life_cycle_hook, permission_request_hook, ad_hook, test_func} from './scenario'

Java.perform(function() {
	if(Java.available) {
		console.log('[+] JVM load success');
    // locationReleatedHook(true, false);
    // cameraReleatedHook(true, true);
    // audioReleatedHook(false);
    life_cycle_hook(false, false);
    permission_request_hook(true, false);
    ad_hook();
    test_func();
	}
})