export function LogAllMethods(): ClassDecorator {
  return function (target: any) {
    const className = target.name; // Get class name directly from the target

    const originalMethods = Object.getOwnPropertyDescriptors(target.prototype);

    for (const methodName in originalMethods) {
      const descriptor = originalMethods[methodName];

      if (typeof descriptor.value === 'function') {
        const originalMethod = descriptor.value;

        // Apply @LogWithDynamicContext() decorator to the method
        descriptor.value = function (...args: any[]) {
          const functionName = methodName;
          const message = args.join(', ');
          // You can modify this according to your logging needs

          // @ts-ignore
          const loggingService = this['loggingService'];

          if (!loggingService) {
            console.error('Logging service not available!');
            return originalMethod.apply(this, args);
          }

          loggingService.updateLogContext(className, functionName);
          return originalMethod.apply(this, args);
        };

        // Assign the modified descriptor back to the method
        Object.defineProperty(target.prototype, methodName, descriptor);
      }
    }

    return target;
  };
}
