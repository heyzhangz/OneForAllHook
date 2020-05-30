import { colors as c } from "../lib/color";
function hook_class_methods(clazz: string) {
	let clazzInstance = Java.use(clazz);
	const uniqueMethods: string[] = clazzInstance.class.getDeclaredMethods().map((method : any) => {
        // perform a cleanup of the method. An example after toGenericString() would be:
        // public void android.widget.ScrollView.draw(android.graphics.Canvas) throws Exception
        // public final rx.c.b<java.lang.Throwable> com.apple.android.music.icloud.a.a(rx.c.b<java.lang.Throwable>)
		    let m: string = method.toGenericString();
        // Remove generics from the method
        while (m.includes("<")) { m = m.replace(/<.*?>/g, ""); }

        // remove any "Throws" the method may have
        if (m.indexOf(" throws ") !== -1) { m = m.substring(0, m.indexOf(" throws ")); }

        // remove scope and return type declarations (aka: first two words)
        // remove the class name
        // remove the signature and return
        m = m.slice(m.lastIndexOf(" "));
        m = m.replace(` ${clazz}.`, "");

        return m.split("(")[0];

      }).filter((value:any, index:any, self:any) => {
        return self.indexOf(value) === index;
	  });

    uniqueMethods.forEach((method) => {
      clazzInstance[method].overloads.forEach((m: any) => {

        // get the argument types for this overload
        const calleeArgTypes: string[] = m.argumentTypes.map((arg:any) => arg.className);
        send(`Hooking ${c.green(clazz)}.${c.greenBright(method)}(${c.red(calleeArgTypes.join(", "))})`);

        // replace the implementation of this method
        // tslint:disable-next-line:only-arrow-functions
        m.implementation = function() {
          send(
            `Called ${c.green(clazz)}.${c.greenBright(m.methodName)}(${c.red(calleeArgTypes.join(", "))})`,
          );
          // actually run the intended method
          return m.apply(this, arguments);
        };

      });
    });
}

Java.perform(function() {
	if(Java.available) {
		console.log('[+] JVM load success');
		let target_class_name = 'android.location.LocationManager';
		hook_class_methods(target_class_name);
	}
})