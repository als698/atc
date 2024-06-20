export function toPlainObject(instance: any): object {
  const plainObject: any = {};
  Object.keys(instance).forEach((key) => {
    if (instance[key] && typeof instance[key].toPlainObject === "function") {
      plainObject[key] = instance[key].toPlainObject();
    } else if (instance[key] && typeof instance[key] === "object") {
      plainObject[key] = toPlainObject(instance[key]);
    } else {
      plainObject[key] = instance[key];
    }
  });
  return plainObject;
}
